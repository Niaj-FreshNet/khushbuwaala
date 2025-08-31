import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
<<<<<<< HEAD

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL,
	// prepareHeaders: (headers) => {
	// 	const token = `Beared ${token}`;
=======
// import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
	// baseUrl: process.env.NEXT_PUBLIC_API_URL,
	baseUrl: "http://localhost:7302/api",
	// prepareHeaders: (headers) => {
	// 	const token = Cookies.get("access_token");
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
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
<<<<<<< HEAD
        "Product",
=======
        "Category",
        "Product",
        "Review",
        "User",
        "Order",
>>>>>>> 86d0ed816e00f2667ef1e4bb43e78d4827648e83
	],
	endpoints: () => ({}),
});

export default baseApi;