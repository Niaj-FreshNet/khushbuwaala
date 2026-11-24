import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const rawBaseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:7302/api",
  // baseUrl: "https://api.khushbuwaala.com/api",
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,

  credentials: "include", // allows cookies for refresh
  prepareHeaders: (headers, { getState }) => {
    // const token = (getState() as RootState).auth.accessTokenn || localStorage.getItem('accessToken');
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// The sign-in pass (access token) is short-lived. When the server says it has expired, ask for a
// new one with the long-lived cookie and repeat the request once. Without this a returning
// customer looked signed in but saw an empty account ("0 orders") until they signed in again.
let refreshing: Promise<boolean> | null = null;

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401 || typeof window === "undefined") return result;

  const url = typeof args === "string" ? args : args.url;
  const hadToken = !!localStorage.getItem("accessToken");
  // Sign-in, sign-up and the refresh call itself answer 401 for their own reasons.
  const ownAnswer = ["/auth/login", "/auth/register", "/auth/refresh-token", "/auth/logout"].some((p) => url.startsWith(p));
  if (!hadToken || ownAnswer) return result;

  if (!refreshing) {
    refreshing = (async () => {
      const refreshed = await rawBaseQuery({ url: "/auth/refresh-token", method: "POST" }, api, extraOptions);
      const token = (refreshed.data as { data?: { accessToken?: string } } | undefined)?.data?.accessToken;
      if (token) {
        api.dispatch({ type: "auth/setAccessToken", payload: token });
        return true;
      }
      // Only a clear "no" from the server signs the customer out; a dropped connection does not.
      const status = refreshed.error?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        api.dispatch({ type: "auth/logout" });
      }
      return false;
    })().finally(() => {
      refreshing = null;
    });
  }

  if (await refreshing) result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Cart",
    "CartSync",
    "Wishlist",
    "Category",
    "Material",
    "Fragrance",
    "Product",
    "Review",
    "Auth",
    "User",
    "Order",
    "Sales",
    "Expenses",
    "Stock",
    "Blog",
    "Discount",
  ],
  endpoints: () => ({}),
});

export default baseApi;
