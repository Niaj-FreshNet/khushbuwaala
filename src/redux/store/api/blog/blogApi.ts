import { baseApi } from '../baseApi';

interface BlogData {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    isPublish: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    slug?: string;
}

interface BlogResponse {
    data: BlogData[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
}

interface SingleBlogResponse {
    blog: BlogData & {
        user: {
            id: string;
            name: string;
            imageUrl: string | null;
            email: string;
        };
    };
    relatedBlogs: {
        id: string;
        title: string;
        content: string;
        imageUrl: string;
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
        slug?: string;
    }[];
}

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addBlog: builder.mutation<BlogData, FormData>({
            query: (formData) => ({
                url: '/blog/create-blog',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Blog'],
        }),
        getAdminBlogs: builder.query<BlogResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/blog/get-all-blogs/admin?page=${page}&limit=${limit}`,
                method: 'GET',
            }),
            providesTags: ['Blog'],
        }),
        getAllBlogs: builder.query<BlogResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/blog/get-all-blogs?page=${page}&limit=${limit}`,
                method: 'GET',
            }),
            providesTags: ['Blog'],
        }),
        // getBlog: builder.query<SingleBlogResponse, string>({
        //     query: (id) => ({
        //         url: `/blog/get-blog/${id}`,
        //         method: 'GET',
        //     }),
        //     providesTags: ['Blog'],
        // }),
        updateBlog: builder.mutation<BlogData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/blog/update-blog/${id}`,
                method: 'PATCH', // Changed to PATCH for partial updates
                body: data,
            }),
            invalidatesTags: ['Blog'],
        }),
        deleteBlog: builder.mutation<void, string>({
            query: (id) => ({
                url: `/blog/delete-blog/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Blog'],
        }),
        getBlog: builder.query<SingleBlogResponse, string>({
            query: (slug) => ({
                url: `/blog/get-blog/${slug}`,
                method: 'GET',
            }),
            providesTags: ['Blog'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useAddBlogMutation,
    useGetAdminBlogsQuery,
    useGetAllBlogsQuery,
    // useGetBlogQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetBlogQuery,
} = blogApi;

export default blogApi;