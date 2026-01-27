import { Fragrance, FragranceApiResponse, FragranceFormValues } from '@/types/fragrance.types';
import { baseApi } from '../baseApi';

export type FragranceUpdateValues = Partial<FragranceFormValues>;

export const fragranceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create fragrance
        createFragrance: builder.mutation<Fragrance, FragranceFormValues>({
            query: (data) => ({
                url: '/fragrances/create-fragrance',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Fragrance'],
        }),

        // Get all fragrances
        getAllFragrances: builder.query<FragranceApiResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 100 }) => ({
                url: '/fragrances/get-all-fragrances',
                params: { page, limit },
            }),
            providesTags: ['Fragrance'],
        }),

        // Get single fragrance by id
        getFragrance: builder.query<Fragrance, string>({
            query: (id: string) => `/fragrances/get-fragrance/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Fragrance', id }],
        }),

        // Update fragrance
        updateFragrance: builder.mutation<Fragrance, { id: string; updatedData: FragranceUpdateValues }>({
            query: ({ id, updatedData }) => ({
                url: `/fragrances/update-fragrance/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Fragrance', id }, 'Fragrance'],
        }),

        // Delete fragrance
        deleteFragrance: builder.mutation<void, string>({
            query: (id: string) => ({
                url: `/fragrances/delete-fragrance/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Fragrance'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateFragranceMutation,
    useGetAllFragrancesQuery,
    useGetFragranceQuery,
    useUpdateFragranceMutation,
    useDeleteFragranceMutation,
} = fragranceApi;