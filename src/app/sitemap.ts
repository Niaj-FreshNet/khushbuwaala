// import { MetadataRoute } from "next";
// import { initializeStore } from "@/redux/store/ssrStore";
// import { productApi } from "@/redux/store/api/product/productApi";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const store = initializeStore();
//   const { data } = await store.dispatch(
//     productApi.endpoints.getAllProducts.initiate({ page: 1, limit: 20 })
//   );
//   const totalPages = data?.meta.totalPage || 1;

//   const urls: MetadataRoute.Sitemap = [
//     {
//       url: "https://khushbuwaala.com/shop",
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 0.8,
//     },
//     ...Array.from({ length: totalPages }, (_, i) => ({
//       url: `https://khushbuwaala.com/shop?page=${i + 1}`,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: i === 0 ? 0.8 : 0.6 / (i + 1),
//     })),
//   ];

//   return urls;
// }