// 'use client';
// import { useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import {
//   useGetMeUserQuery,
//   useRefreshTokenMutation,
// } from '@/redux/store/api/auth/authApi';
// import { setUser, setAccessToken, logout as logoutSlice } from '@/redux/store/features/auth/authSlice';
// import { toast } from 'sonner';

// export const useLoadUser = () => {
//   const dispatch = useDispatch();
//   const isRefreshing = useRef(false);

//   const {
//     data: userData,
//     isSuccess,
//     isError,
//     refetch,
//     error,
//   } = useGetMeUserQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//     refetchOnReconnect: true,
//   });

//   const [refreshToken] = useRefreshTokenMutation();

//   useEffect(() => {
//     const loadUser = async () => {
//       // If user is already fetched successfully
//       if (isSuccess && userData?.data) {
//         dispatch(setUser({
//           user: userData.data,
//           accessToken: localStorage.getItem('accessToken') || '',
//         }));
//         return;
//       }

//       // Only attempt refresh if there was an error and we're not already refreshing
//       if (isError && !isRefreshing.current) {
//         isRefreshing.current = true;
//         try {
//           const result = await refreshToken().unwrap();
//           if (result?.accessToken) {
//             // Update Redux and localStorage
//             dispatch(setAccessToken(result.accessToken));
//             // Refetch the user with new token
//             refetch();
//           }
//         } catch (err) {
//           console.error('Refresh token failed:', err);
//           toast.error('Session expired. Please login again.');
//           dispatch(logoutSlice());
//         } finally {
//           isRefreshing.current = false;
//         }
//       }
//     };

//     loadUser();
//   }, [isSuccess, isError, userData, dispatch, refreshToken, refetch]);
// };
