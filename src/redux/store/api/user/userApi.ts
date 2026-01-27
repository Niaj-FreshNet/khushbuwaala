import { TUser } from "@/types/auth.types";
import baseApi from "../baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query<TUser[], void>({
            query: () => ({
                url: '/user/get-all-users',
                method: 'GET',
            }),
            transformResponse: (response: { success: boolean; data: TUser[] }) => response.data,
            providesTags: ['User'],
        }),

        getUserProfile: builder.query({
            query: () => ({
                url: '/user/profile',
                transformResponse: (response: { success: boolean; data: TUser[] }) => response.data,
                method: 'GET'
            }),
            providesTags: ['User'],
        }),

        getUserById: builder.query({
            query: (id) => ({
                url: `/user/get-user-by-id/${id}`,
                transformResponse: (response: { success: boolean; data: TUser[] }) => response.data,
                method: 'GET'
            }),
            providesTags: ['User'],
        }),

        updateUserProfile: builder.mutation<
            TUser, // response type
            { id: string; updates: Partial<TUser> } // request type
        >({
            query: ({ id, updates }) => ({
                url: `/user/update-profile/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["User"],
        }),

        changePassword: builder.mutation({
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
    useGetAllUsersQuery,
    useGetUserProfileQuery,
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
} = userApi;

export default userApi;
