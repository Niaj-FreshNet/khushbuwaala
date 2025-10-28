import baseApi from "../baseApi";

const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getAllSales: builder.query({
      query: ({ searchTerm, page, limit }) => ({
        url: "/sales/get-all-sales",
        method: "GET",
        params: {
          searchTerm,
          page: String(page), // Ensure page is a string
          limit: String(limit), // Ensure limit is a string


        },
      }),
      providesTags: ['Sales'],
    }),



    //get user sales 
    getUserSales: builder.query({
      query: (id) => ({
        url: `/sales/get-user-sales/${id}`,
        method: "GET",
      }),
      providesTags: ['Sales'],
    }),


    // sale deatils api
    getUserSaleDetils: builder.query({
      query: (id) => ({
        url: `/sales/my-sales/${id}`,
        method: "GET",
      }),
      providesTags: ['Sales'],
    }),
    // admin sale deatils api 
    getAdminSaleDetils: builder.query({
      query: (id) => ({
        url: `/sales/get-user-sales/${id}`,
        method: "GET",
      }),
      providesTags: ['Sales'],
    }),





    // Update Category API (PATCH)
    updateSales: builder.mutation({
      query: ({ id, status }) => ({
        url: `/sales/update-sale-status/${id}`, // Adjust your actual update endpoint
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Sales'], // Invalidate the 'Categories' tag to refetch data
    }),

    // Add Sale API (POST)
    addSale: builder.mutation<any, any>({
      // Define the mutation for adding a sale
      query: (body) => ({
        url: "/sales/create-sale", // Backend route for adding sale
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales"], // Invalidate 'Sales' to refetch all sales after adding
    }),

    // ✅ Get order by ID (Admin)
    getSaleById: builder.query({
      query: (id) => ({
        url: `/sales/get-sale-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ['Sales'],
    }),

  }),
  overrideExisting: false,

});

export const {

  useGetAllSalesQuery, // Export the query hook for fetching all Sales
  useGetUserSalesQuery,
  useGetUserSaleDetilsQuery,
  useGetAdminSaleDetilsQuery,

  useUpdateSalesMutation, // Export the update mutation hook
  useAddSaleMutation, // Export the new add sale mutation hook
  useGetSaleByIdQuery,

} = salesApi;

export default salesApi;