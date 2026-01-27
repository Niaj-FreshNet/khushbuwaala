import { Material, MaterialApiResponse, MaterialFormValues } from '@/types/material.types';
import { baseApi } from '../baseApi';

export type MaterialUpdateValues = Partial<MaterialFormValues>;

export const materialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create material
        createMaterial: builder.mutation<Material, MaterialFormValues>({
            query: (data) => ({
                url: '/materials/create-material',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Material'],
        }),

        // Get all materials
        getAllMaterials: builder.query<MaterialApiResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: '/materials/get-all-materials',
                params: { page, limit },
            }),
            providesTags: ['Material'],
        }),

        // Get single material by id
        getMaterial: builder.query<Material, string>({
            query: (id: string) => `/materials/get-material/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Material', id }],
        }),

        // Update material
        updateMaterial: builder.mutation<Material, { id: string; updatedData: MaterialUpdateValues }>({
            query: ({ id, updatedData }) => ({
                url: `/materials/update-material/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Material', id }, 'Material'],
        }),

        // Delete material
        deleteMaterial: builder.mutation<void, string>({
            query: (id: string) => ({
                url: `/materials/delete-material/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Material'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateMaterialMutation,
    useGetAllMaterialsQuery,
    useGetMaterialQuery,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation,
} = materialApi;