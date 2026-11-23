import Link from "next/link";
import { fetchSimilar, slimItem } from "@/lib/discovery";
import { ProductCard } from "@/components/ReusableUI/ProductCard";
import type { IProductResponse } from "@/types/product.types";

// Perfumes that smell alike (shared notes and scent families, in stock), from the discovery API.
// Rendered on the server so the links are part of the page. Shows nothing if there are none.
export default async function SimilarScents({ slug, name, familyId }: { slug: string; name: string; familyId?: string }) {
  const items = (await fetchSimilar(slug, 8)).map(slimItem);
  if (!items.length) return null;

  return (
    <section aria-labelledby="similar-heading" className="px-3 py-6 sm:px-4 lg:px-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 id="similar-heading" className="text-lg font-bold text-stone-900 sm:text-xl">
            If you like {name}
          </h2>
          <p className="text-[13px] text-stone-600">These share its notes and character.</p>
        </div>
        {familyId && (
          <Link href={`/shop?families=${familyId}`} className="shrink-0 text-sm font-semibold text-emerald-800 underline underline-offset-2">
            See more
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        {items.map((item) => (
          <li key={item.id}>
            <ProductCard product={item as unknown as IProductResponse} />
          </li>
        ))}
      </ul>
    </section>
  );
}
