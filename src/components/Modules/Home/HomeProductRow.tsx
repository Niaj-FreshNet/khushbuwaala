import Link from "next/link"
import { fetchDiscovery, parseShopState } from "@/lib/discovery"
import type { IProductResponse } from "@/types/product.types"
import { ProductCarouselClient } from "./ProductCarouselClient"

// One row of products on the home page, fetched on the server so the products (and their links)
// are in the page's HTML: visible at once on slow phones and readable by search engines.
// `query` is the same as a shop address, e.g. "category=oriental-attar" or "sort=newest".
export async function HomeProductRow({
  title,
  query,
  href,
  linkLabel = "See all",
  limit = 10,
}: {
  title: string
  query: string
  href: string
  linkLabel?: string
  limit?: number
}) {
  const params = Object.fromEntries(new URLSearchParams(query))
  const result = await fetchDiscovery(parseShopState(params), limit)
  // in stock first is already the default order; a row with nothing to show is left out
  const products = (result?.data ?? []).filter((p) => p.inStock)
  if (products.length < 2) return null

  return (
    <div>
      <ProductCarouselClient products={products as unknown as IProductResponse[]} title={title} titleVariant="premium" />
      <div className="-mt-5 mb-8 text-center sm:-mt-6 sm:mb-10">
        <Link
          href={href}
          className="inline-flex h-10 items-center rounded-full border border-stone-300 px-5 text-sm font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-900"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  )
}
