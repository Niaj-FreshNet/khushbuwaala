import type { TUser } from "@/types/auth.types";
import type { ApiEnvelope } from "@/types/order.types";
import baseApi from "../baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // The signed-in customer's own details.
        getUserProfile: builder.query<TUser, void>({
            query: () => ({
                url: '/user/profile',
                method: 'GET',
            }),
            transformResponse: (response: ApiEnvelope<TUser>) => response.data,
            providesTags: ['User'],
        }),

        updateUserProfile: builder.mutation<ApiEnvelope<TUser>, { id: string; updates: Partial<TUser> }>({
            query: ({ id, updates }) => ({
                url: `/user/update-profile/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["User"],
        }),

        changePassword: builder.mutation<ApiEnvelope<unknown>, { oldPassword: string; newPassword: string }>({
            query: (data) => ({
                url: '/user/change-password',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User', 'Auth'],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
} = userApi;

export default userApi;
