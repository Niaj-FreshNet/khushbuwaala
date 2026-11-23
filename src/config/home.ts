// The product rows on the home page, top to bottom. `query` is written exactly like a shop
// address (see src/lib/discovery.ts), so any filter the shop understands can be a row:
//   "sort=popular"            best sellers
//   "category=oriental-attar" one collection
//   "notes=oud&maxPrice=500"  a theme
// A row with fewer than two products in stock is left out automatically.
export type HomeRow = { title: string; query: string; href: string; linkLabel?: string; limit?: number }

export const homeRows: HomeRow[] = [
  { title: "Best Sellers", query: "sort=popular&inStock=1", href: "/shop", linkLabel: "See all perfumes" },
  { title: "Arabian Attar", query: "category=oriental-attar&inStock=1", href: "/oriental-attar", linkLabel: "All Arabian attar" },
  { title: "Oud Collection", query: "category=artificial-oud&inStock=1", href: "/artificial-oud", linkLabel: "All oud" },
  { title: "Inspired Perfume Oils", query: "category=inspired-perfume-oil&inStock=1", href: "/inspired-perfume-oil", linkLabel: "All inspired oils" },
  { title: "New Arrivals", query: "sort=newest&inStock=1", href: "/new-arrivals", linkLabel: "All new arrivals" },
]
