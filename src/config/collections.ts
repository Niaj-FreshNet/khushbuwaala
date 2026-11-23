// Every shop / collection page in one place: address, wording and which products it shows.
// `locked.category` uses the category's name in lowercase with dashes (the admin's
// "ARTIFICIAL OUD" is "artificial-oud"). A page whose category has no products shows a friendly
// note instead of an empty grid and is kept out of search engines until products are added.
import type { ShopListingConfig } from "@/components/Modules/Shop/ShopListing";

export const collections = {
  shop: {
    basePath: "/shop",
    heading: "All perfumes & attars",
    intro:
      "Not sure what to pick? Tell us how you want to smell — fresh, sweet, woody, a touch of oud — and how long it should last. The filters do the rest.",
    title: "Shop Perfume Oils & Attars",
    description:
      "Browse Khushbuwaala's full collection of perfume oils, attars and oud. Filter by scent family, notes, how long it lasts and budget. Delivery all over Bangladesh.",
  },
  "inspired-perfume-oil": {
    basePath: "/inspired-perfume-oil",
    heading: "Inspired perfume oils",
    intro:
      "Alcohol-free oils made in the style of well-known designer and niche perfumes. A few drops on the pulse points go a long way.",
    title: "Inspired Perfume Oils",
    description:
      "Alcohol-free perfume oils inspired by popular designer and niche fragrances. Choose by scent, strength and budget at Khushbuwaala.",
    locked: { category: ["inspired-perfume-oil"] },
  },
  "oriental-attar": {
    basePath: "/oriental-attar",
    heading: "Oriental & Arabian attar",
    intro:
      "Musk, amber, bakhoor and mukhallat blends in the Arabian tradition: warm, rich and made to be noticed.",
    title: "Oriental & Arabian Attar",
    description:
      "Arabian-style attars: musk, amber, bakhoor and mukhallat blends. Alcohol-free and long-lasting, from Khushbuwaala.",
    locked: { category: ["oriental-attar"] },
  },
  "artificial-oud": {
    basePath: "/artificial-oud",
    heading: "Oud collection",
    intro:
      "Blended oud oils for people who love that deep, woody, slightly smoky character without the price of pure agarwood.",
    title: "Oud Oil Collection",
    description:
      "Blended oud oils with deep, woody, smoky character. Compare strength and longevity and pick your size at Khushbuwaala.",
    locked: { category: ["artificial-oud"] },
  },
  "organic-attar": {
    basePath: "/organic-attar",
    heading: "Natural attar",
    intro: "Traditional attars such as ruh khus, distilled from natural materials. Earthy, calm and close to the skin.",
    title: "Natural Attar Oils",
    description: "Traditional natural attars such as ruh khus. Earthy, calm scents in several sizes from Khushbuwaala.",
    locked: { category: ["natural-attar-oil"] },
  },
  "brand-perfumes": {
    basePath: "/brand-perfumes",
    heading: "Brand perfumes",
    intro: "Spray perfumes from established fragrance houses, for when you want the original bottle.",
    title: "Brand Perfumes",
    description: "Spray perfumes from established fragrance houses, available from Khushbuwaala with delivery across Bangladesh.",
    locked: { category: ["brand-perfumes"] },
  },
  "niche-perfumes": {
    basePath: "/niche-perfumes",
    heading: "Niche perfumes",
    intro: "Less common fragrances from smaller perfume houses.",
    title: "Niche Perfumes",
    description: "Niche perfumes from smaller fragrance houses at Khushbuwaala.",
    locked: { category: ["niche-perfumes"] },
  },
  "gifts-and-packages": {
    basePath: "/gifts-and-packages",
    heading: "Gift sets & combo packages",
    intro:
      "Several scents in one box. A good way to try different styles, or to gift someone whose taste you are still guessing.",
    title: "Perfume Gift Sets & Combo Packages",
    description:
      "Perfume oil gift sets and combo packages: several scents in one box, ready to gift. Order from Khushbuwaala with delivery across Bangladesh.",
    locked: { category: ["gifts-and-packages"] },
  },
  accessories: {
    basePath: "/accessories",
    heading: "Accessories",
    intro: "Bottles and other fragrance accessories.",
    title: "Perfume Accessories",
    description: "Fragrance accessories from Khushbuwaala.",
    locked: { category: ["accessories"] },
  },
  "womens-perfume": {
    basePath: "/womens-perfume",
    heading: "Perfumes for her",
    intro: "Scents made for women, together with the unisex ones that women wear just as well.",
    title: "Perfume Oils for Women",
    description:
      "Perfume oils and attars for women, including unisex favourites. Filter by floral, sweet, fresh or musky at Khushbuwaala.",
    locked: { gender: ["women"] },
  },
  "new-arrivals": {
    basePath: "/new-arrivals",
    heading: "New arrivals",
    intro: "The latest additions to our collection, newest first.",
    title: "New Arrivals",
    description: "The newest perfume oils and attars added to the Khushbuwaala collection.",
    defaultSort: "newest",
  },
} satisfies Record<string, ShopListingConfig>;

export type CollectionKey = keyof typeof collections;
