'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { TUser } from '@/types/auth.types';
import { useGetMeUserQuery, useRefreshTokenMutation } from '@/redux/store/api/auth/authApi';
import { setUser, setAccessToken, logout as logoutSlice } from '@/redux/store/features/auth/authSlice';
import { toast } from 'sonner';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // 1️⃣ Pull current auth state from Redux
  const reduxUser = useAppSelector((state) => state.auth?.user);
  const reduxToken = useAppSelector((state) => state.auth?.accessToken);

  // The newest values, for the two effects below. They must not run again every time the
  // customer's details change (the first one writes those details itself).
  const latest = useRef({ user: reduxUser, token: reduxToken });
  latest.current = { user: reduxUser, token: reduxToken };

  const [isLoading, setIsLoading] = useState(true);
  const isRefreshing = useRef(false);

  const storedToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') || Cookies.get('accessToken')
      : null;

  // 2️⃣ Fetch fresh user profile details from backend
  const { data: userData, isSuccess, refetch } = useGetMeUserQuery(undefined, {
    skip: !storedToken && !reduxToken,
    refetchOnMountOrArgChange: true,
  });

  const [refreshTokenApi] = useRefreshTokenMutation();

  // 3️⃣ 👉 UPDATE HERE: Sync full profile (name, image) into Redux whenever getMe succeeds
  useEffect(() => {
    if (isSuccess && userData?.data) {
      dispatch(
        setUser({
          user: { ...latest.current.user, ...userData.data },
          accessToken: localStorage.getItem('accessToken') || latest.current.token || '',
        })
      );
    }
  }, [isSuccess, userData, dispatch]);

  // 4️⃣ Token initialization and refresh logic
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      const token = Cookies.get('accessToken') || localStorage.getItem('accessToken') || null;
      const refresh = Cookies.get('refreshToken') || localStorage.getItem('refreshToken') || null;

      if (token) {
        localStorage.setItem('accessToken', token);
      }
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }

      if (token && !latest.current.user) {
        try {
          const decoded = jwtDecode<TUser>(token);
          dispatch(setUser({ user: decoded, accessToken: token }));
        } catch {
          localStorage.removeItem('accessToken');
          Cookies.remove('accessToken', { path: '/' });
        }
      }

      if (!token && refresh && !isRefreshing.current) {
        isRefreshing.current = true;
        try {
          const result = await refreshTokenApi().unwrap();
          const fresh = result?.data?.accessToken || result?.accessToken;
          if (fresh) {
            localStorage.setItem('accessToken', fresh);
            dispatch(setAccessToken(fresh));
            refetch();
          }
        } catch (err) {
          console.error('Refresh token failed', err);
          toast.error('Session expired. Please login again.');
          dispatch(logoutSlice());
        } finally {
          isRefreshing.current = false;
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [dispatch, refetch, refreshTokenApi]);

  return {
    user: reduxUser,
    isAuthenticated: !!reduxUser,
    accessToken: reduxToken,
    isLoading,
  };
};