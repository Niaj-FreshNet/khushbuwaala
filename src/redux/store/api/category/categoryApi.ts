import { Category, CategoryApiResponse, CategoryFormValues } from '@/types/category.types';
import { baseApi } from '../baseApi';

export type CategoryUpdateValues = Partial<CategoryFormValues>;

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create category (with image upload)
    createCategory: builder.mutation<Category, FormData>({
      query: (data: FormData) => ({
        url: '/category/create-category',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    // Get categories (public)
    getAllCategories: builder.query<CategoryApiResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/category/get-categories',
        params: { page, limit },
      }),
      providesTags: ['Category'],
    }),

    // Get all categories (admin)
    getAllCategoriesAdmin: builder.query<CategoryApiResponse, void>({
      query: () => '/category/get-all-categories',
      providesTags: ['Category'],
    }),

    // Get single category by id
    getCategory: builder.query<Category, string>({
      query: (id: string) => `/category/get-category/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    // Update category (with optional image)
    updateCategory: builder.mutation<Category, { id: string; updatedData: FormData | CategoryUpdateValues }>({
      query: ({ id, updatedData }) => ({
        url: `/category/update-category/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),

    // Delete category
    deleteCategory: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/category/delete-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetAllCategoriesAdminQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;