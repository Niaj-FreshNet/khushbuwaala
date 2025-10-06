'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { TUser } from '@/types/auth.types';
import { useGetMeUserQuery, useRefreshTokenMutation } from '@/redux/store/api/auth/authApi';
import { setUser, setAccessToken, logout as logoutSlice } from '@/redux/store/features/auth/authSlice';
import { toast } from 'sonner';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [user, setUserState] = useState<TUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRefreshing = useRef(false);

  const { data: userData, isSuccess, isError, refetch } = useGetMeUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [refreshTokenApi] = useRefreshTokenMutation();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // 1️⃣ Read tokens from cookies
      const token = Cookies.get('accessToken') || null;
      const refresh = Cookies.get('refreshToken') || null;

      setAccessTokenState(token);
      setRefreshTokenState(refresh);

      // 2️⃣ Sync token to localStorage (needed for RTK Query)
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }

      // 3️⃣ Decode user if token exists
      if (token) {
        try {
          const decoded = jwtDecode<TUser>(token);
          setUserState(decoded);
          dispatch(setUser({ user: decoded, accessToken: token }));
        } catch {
          setUserState(null);
        }
      }

      // 4️⃣ If no access token but refresh token exists → try refresh
      if (!token && refresh && !isRefreshing.current) {
        isRefreshing.current = true;
        try {
          const result = await refreshTokenApi().unwrap();
          if (result?.accessToken) {
            setAccessTokenState(result.accessToken);
            localStorage.setItem('accessToken', result.accessToken);
            dispatch(setAccessToken(result.accessToken));
            refetch(); // fetch user data with new token
          }
        } catch (err) {
          console.error('Refresh token failed', err);
          toast.error('Session expired. Please login again.');
          dispatch(logoutSlice());
          setUserState(null);
        } finally {
          isRefreshing.current = false;
        }
      }

      // 5️⃣ If API returned user data, use it
      if (isSuccess && userData?.data) {
        setUserState(userData.data);
        dispatch(setUser({ user: userData.data, accessToken: localStorage.getItem('accessToken') || '' }));
      }

      setIsLoading(false);
    };

    initAuth();
  }, [dispatch, isSuccess, isError, userData, refetch, refreshTokenApi]);

  return {
    user,
    isAuthenticated: !!user,
    accessToken,
    refreshToken,
    isLoading,
  };
};
