import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
	// baseUrl: process.env.NEXT_PUBLIC_API_URL,
	baseUrl: "http://localhost:7302/api",
	// prepareHeaders: (headers) => {
	// 	const token = Cookies.get("access_token");
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
        "Category",
        "Product",
        "Review",
        "User",
        "Order",
	],
	endpoints: () => ({}),
});

export default baseApi;