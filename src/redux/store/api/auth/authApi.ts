import type { TUser } from "@/types/auth.types";
import type { ApiEnvelope } from "@/types/order.types";
import baseApi from "../baseApi";

// The sign-in pass. Most routes send it inside `data`; an older answer had it at the top level.
type TokenAnswer = ApiEnvelope<{ accessToken?: string; refreshToken?: string } | null> & { accessToken?: string };

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logIn: builder.mutation<TokenAnswer, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<ApiEnvelope<unknown>, { name: string; email: string; password: string }>({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation<ApiEnvelope<unknown>, { email: string }>({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<ApiEnvelope<unknown>, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
      invalidatesTags: ['Auth'],
    }),

    getMeUser: builder.query<ApiEnvelope<TUser | null>, void>({
      query: () => ({
        url: '/auth/get-me',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Auth', 'User'],
    }),

    refreshToken: builder.mutation<TokenAnswer, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include", // the long-lived sign-in cookie
      }),
      invalidatesTags: ['Auth'],
    }),

    userVerification: builder.mutation<TokenAnswer, { email: string; token: string }>({
      query: ({ email, token }) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: { email, token },
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    resendOtp: builder.mutation<ApiEnvelope<unknown>, { email: string }>({
      query: ({ email }) => ({
        url: '/auth/resend-verify-email-token',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<ApiEnvelope<unknown>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include', // needed to clear the sign-in cookie
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLogInMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useGetMeUserQuery,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useUserVerificationMutation,
  useResendOtpMutation,
  useLogoutMutation,
} = authApi;

export default authApi;
