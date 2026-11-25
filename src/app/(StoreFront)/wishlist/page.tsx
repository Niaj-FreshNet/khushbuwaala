"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/ReusableUI/ProductCard";
import { ShopProductsSkeletonGrid } from "@/components/Modules/Shop/ShopProductsSkeletonGrid";
import type { DiscoveryItem } from "@/lib/discovery";

const API = process.env.NEXT_PUBLIC_API_URL;
const GRID = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  // the saved list lives in the browser, so the first server-rendered frame has nothing to show
  const [mounted, setMounted] = useState(false);
  const [fresh, setFresh] = useState<Map<string, DiscoveryItem> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => setMounted(true), []);

  const idsKey = useMemo(() => items.map((i) => i.product.id).sort().join(","), [items]);

  // Current price, stock and offers for everything saved (the saved copy may be weeks old).
  useEffect(() => {
    if (!idsKey) {
      setFresh(new Map());
      return;
    }
    const controller = new AbortController();
    setFailed(false);
    fetch(`${API}/discover?ids=${idsKey}&limit=100`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((body) => setFresh(new Map((body.data as DiscoveryItem[]).map((p) => [p.id, p]))))
      .catch((err) => {
        if (err?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, [idsKey]);

  const count = items.length;
  const loading = !mounted || (count > 0 && fresh === null && !failed);
  const available = fresh ? items.filter((i) => fresh.has(i.product.id)) : [];
  const unavailable = fresh ? items.filter((i) => !fresh.has(i.product.id)) : [];

  return (
    <div className="container mx-auto min-h-[60vh] px-3 pb-10 pt-4 sm:px-4 sm:pt-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Your wishlist</h1>
          <p className="mt-1 text-sm text-stone-600">
            {!mounted
              ? "Loading your saved perfumes…"
              : count === 0
                ? "Perfumes you save with the heart appear here."
                : `${count} saved ${count === 1 ? "perfume" : "perfumes"}`}
          </p>
        </div>
        {mounted && count > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="min-h-0! inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-stone-300 px-3 text-[13px] font-semibold text-stone-700 hover:border-red-300 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      <div className="mt-5">
        {loading ? (
          <ShopProductsSkeletonGrid count={4} colsClass={GRID} />
        ) : count === 0 ? (
          <div className="rounded-2xl border border-stone-200 px-6 py-14 text-center">
            <Heart className="mx-auto h-10 w-10 text-stone-300" strokeWidth={1.5} />
            <h2 className="mt-3 text-lg font-semibold text-stone-900">Nothing saved yet</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-stone-600">
              Tap the heart on any perfume to keep it here while you decide. Sign in and it follows you to your other
              devices.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex h-10 items-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white"
            >
              Find a perfume
            </Link>
          </div>
        ) : failed ? (
          <div className="rounded-2xl border border-stone-200 px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-stone-900">We could not load your saved perfumes</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-stone-600">
              They are still saved. Please check your connection and reload the page.
            </p>
            <ul className="mx-auto mt-4 max-w-sm space-y-1 text-left text-sm">
              {items.map((i) => (
                <li key={i.product.id}>
                  <Link href={`/product/${i.product.slug}`} className="font-medium text-emerald-800 underline underline-offset-2">
                    {i.product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <ul className={`grid ${GRID} gap-2 sm:gap-3`}>
              {available.map((i, index) => (
                <li key={i.product.id}>
                  <ProductCard product={fresh!.get(i.product.id)!} priority={index < 4} />
                </li>
              ))}
            </ul>

            {unavailable.length > 0 && (
              <section className="mt-8">
                <h2 className="text-base font-semibold text-stone-900">No longer available</h2>
                <p className="mt-0.5 text-sm text-stone-600">
                  These are not in the shop at the moment. Message us if you would like to know when they return.
                </p>
                <ul className="mt-3 divide-y divide-stone-100 rounded-2xl border border-stone-200">
                  {unavailable.map((i) => (
                    <li key={i.product.id} className="flex items-center gap-3 p-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100 grayscale">
                        {i.product.primaryImage && (
                          <Image src={i.product.primaryImage} alt="" fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-700">{i.product.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(i.product.id)}
                        className="min-h-0! h-9 shrink-0 rounded-full border border-stone-300 px-3 text-[13px] font-semibold text-stone-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
