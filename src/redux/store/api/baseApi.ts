import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL,
	// prepareHeaders: (headers) => {
	// 	const token = `Beared ${token}`;
	// 	if (token) {
	// 		headers.set("Authorization", token);
	// 	}
	// 	return headers;
	// },
});

export const baseApi = createApi({
	reducerPath: "baseApi",
	baseQuery,
	tagTypes: [
		"Cart",
        "CartSync",
        "Wishlist",
        "Product",
	],
	endpoints: () => ({}),
});

export default baseApi;