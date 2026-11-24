"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/ReusableUI/ProductCard";
import { ProductQuickView } from "@/components/ReusableUI/ProductQuickView";
import { cn } from "@/lib/utils";
import {
  FACET_GROUPS,
  SORT_OPTIONS,
  countActiveFilters,
  formatTaka,
  shopHref,
  type DiscoveryItem,
  type DiscoveryResponse,
  type FacetGroup,
  type ShopState,
} from "@/lib/discovery";
import { kwPushSearch, kwPushSelectItem, kwPushViewItemList } from "@/lib/Analytics/kwEcom";
import type { IProductResponse } from "@/types/product.types";
import { siteConfig } from "@/config/site";
import { FilterPanel } from "./FilterPanel";

type Locked = Partial<Record<FacetGroup, string[]>>;

type Props = {
  basePath: string;
  listName: string;
  state: ShopState;
  locked?: Locked;
  result: DiscoveryResponse | null;
};

const asProduct = (item: DiscoveryItem) => item as unknown as IProductResponse;

export function ShopView({ basePath, listName, state, locked = {}, result }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickView, setQuickView] = useState<DiscoveryItem | null>(null);
  const [searchText, setSearchText] = useState(state.q);
  const lastSentQuery = useRef(state.q);
  const topRef = useRef<HTMLDivElement | null>(null);

  // A collection page hides the "Collection" choice. A scent or note page keeps its group visible,
  // so "Woody" can still be combined with "Sweet"; only its own value cannot be switched off.
  const lockedGroups = useMemo(
    () => FACET_GROUPS.filter((g) => (locked[g] ?? []).length > 0 && g !== "families" && g !== "notes"),
    [locked]
  );
  const activeCount = countActiveFilters(state, locked);

  const go = useCallback(
    (next: ShopState, how: "push" | "replace" = "push") => {
      const href = shopHref(basePath, next, locked);
      startTransition(() => {
        if (how === "replace") router.replace(href, { scroll: false });
        else router.push(href, { scroll: false });
      });
    },
    [basePath, locked, router]
  );

  const change = useCallback((patch: Partial<ShopState>) => go({ ...state, ...patch, page: 1 }), [go, state]);

  const toggle = useCallback(
    (group: FacetGroup, id: string) => {
      if ((locked[group] ?? []).includes(id)) return; // this page is about that value
      const current = state[group];
      change({ [group]: current.includes(id) ? current.filter((v) => v !== id) : [...current, id] } as Partial<ShopState>);
    },
    [change, state, locked]
  );

  const clearAll = () => {
    const cleared = { ...state, q: "", page: 1, minPrice: undefined, maxPrice: undefined, inStock: false, onSale: false } as ShopState;
    for (const g of FACET_GROUPS) cleared[g] = locked[g] ?? [];
    setSearchText("");
    lastSentQuery.current = "";
    go(cleared);
  };

  // The address can change without typing (back button, a suggestion link): follow it.
  useEffect(() => {
    if (state.q !== lastSentQuery.current) {
      lastSentQuery.current = state.q;
      setSearchText(state.q);
    }
  }, [state.q]);

  // Typing searches after a short pause; it replaces the address so Back does not replay each letter.
  useEffect(() => {
    const q = searchText.trim();
    if (q === lastSentQuery.current) return;
    const timer = setTimeout(() => {
      lastSentQuery.current = q;
      go({ ...state, q, page: 1 }, "replace");
    }, 350);
    return () => clearTimeout(timer);
  }, [searchText, go, state]);

  // Analytics: one list view per result set; one search event per searched text.
  const items = useMemo(() => result?.data ?? [], [result]);
  const listKey = `${basePath}|${JSON.stringify(state)}`;
  const trackedList = useRef<string | null>(null);
  const trackedSearch = useRef<string>("");
  useEffect(() => {
    if (!result || trackedList.current === listKey) return;
    trackedList.current = listKey;
    kwPushViewItemList({ listName, items, page: result.meta.page, limit: result.meta.limit });
    if (state.q && trackedSearch.current !== state.q) {
      trackedSearch.current = state.q;
      kwPushSearch({ searchTerm: state.q, results: result.meta.total });
    }
  }, [result, listKey, listName, items, state.q]);

  const goToPage = (page: number) => {
    go({ ...state, page });
    topRef.current?.scrollIntoView({ block: "start" });
  };

  // Chips for what is switched on, each removable
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (result) {
    for (const group of FACET_GROUPS) {
      for (const id of state[group]) {
        if ((locked[group] ?? []).includes(id)) continue;
        const label = result.facets[group]?.find((o) => o.id === id)?.label ?? id;
        chips.push({ key: `${group}:${id}`, label, remove: () => toggle(group, id) });
      }
    }
  }
  if (state.maxPrice !== undefined || state.minPrice !== undefined) {
    const label =
      state.minPrice !== undefined && state.maxPrice !== undefined
        ? `${formatTaka(state.minPrice)} – ${formatTaka(state.maxPrice)}`
        : state.maxPrice !== undefined
          ? `Under ${formatTaka(state.maxPrice)}`
          : `Over ${formatTaka(state.minPrice ?? 0)}`;
    chips.push({ key: "price", label, remove: () => change({ minPrice: undefined, maxPrice: undefined }) });
  }
  if (state.inStock) chips.push({ key: "stock", label: "In stock", remove: () => change({ inStock: false }) });
  if (state.onSale) chips.push({ key: "sale", label: "On offer", remove: () => change({ onSale: false }) });

  const total = result?.meta.total ?? 0;
  const sortValue = state.sort || (state.q ? "relevance" : "popular");

  const panel = result ? (
    <FilterPanel facets={result.facets} state={state} lockedGroups={lockedGroups} onToggle={toggle} onChange={change} />
  ) : null;

  return (
    <div className="mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] px-3 sm:px-4 lg:px-6 2xl:px-8">
      <div ref={topRef} className="scroll-mt-24" />

      {/* Controls */}
      <div className="sticky top-[var(--kw-nav-offset,4rem)] z-30 -mx-3 border-b border-stone-200 bg-white px-3 py-2 transition-[top] duration-500 ease-out motion-reduce:transition-none sm:-mx-4 sm:px-4 lg:static lg:mx-0 lg:border-0 lg:px-0 lg:pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="min-h-0! inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3.5 text-sm font-semibold text-stone-900 lg:hidden"
            aria-haspopup="dialog"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Try “oud”, “sweet”, “rose”, “গোলাপ”…"
              aria-label="Search perfumes by name, scent or note"
              className="h-10 w-full rounded-full border border-stone-300 bg-white pl-9 pr-9 text-base! text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
                className="min-h-0! absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <label className="hidden shrink-0 items-center gap-2 text-sm text-stone-600 sm:flex">
            <span className="hidden md:inline">Sort</span>
            <select
              value={sortValue}
              onChange={(e) => change({ sort: e.target.value })}
              aria-label="Sort products"
              className="h-10 rounded-full border border-stone-300 bg-white px-3 text-sm! font-medium text-stone-900 focus:border-emerald-700 focus:outline-none"
            >
              {state.q && <option value="relevance">Best match</option>}
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Result line + sort on phones */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[13px] text-stone-600" aria-live="polite">
            {result ? (
              <>
                <span className="font-semibold text-stone-900">{total}</span> {total === 1 ? "perfume" : "perfumes"}
                {state.q && (
                  <>
                    {" "}
                    for “<span className="font-medium text-stone-900">{state.q}</span>”
                  </>
                )}
                {pending && <span className="ml-2 text-stone-400">Updating…</span>}
              </>
            ) : (
              "Could not load perfumes"
            )}
          </p>
          <select
            value={sortValue}
            onChange={(e) => change({ sort: e.target.value })}
            aria-label="Sort products"
            className="h-8 max-w-[52%] rounded-full border border-stone-300 bg-white px-2.5 text-[13px]! font-medium text-stone-900 focus:outline-none sm:hidden"
          >
            {state.q && <option value="relevance">Best match</option>}
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {chips.length > 0 && (
          <div className="-mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.remove}
                aria-label={`Remove filter ${chip.label}`}
                className="min-h-0! inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-emerald-50 pl-3 pr-2 text-[13px] font-medium text-emerald-900"
              >
                {chip.label}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="min-h-0! h-8 shrink-0 px-2 text-[13px] font-semibold text-stone-700 underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-6 lg:mt-0">
        {/* Desktop filters */}
        {panel && (
          <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
            <div className="sticky top-[calc(var(--kw-nav-offset,4rem)+1rem)] max-h-[calc(100vh-6rem)] transition-[top] duration-500 ease-out overflow-y-auto rounded-2xl border border-stone-200 bg-white px-4 py-1">
              {panel}
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          {!result ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
              <h2 className="text-lg font-semibold text-stone-900">We could not load the perfumes just now</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-stone-600">
                Please check your connection and try again. If it keeps happening, message us and we will help you order.
              </p>
              <button
                type="button"
                onClick={() => router.refresh()}
                className="mt-4 inline-flex h-10 items-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-stone-900">Nothing matches all of that together</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-stone-600">
                {chips.length > 0
                  ? "Try removing one of your choices. Tap any of them to take it off:"
                  : "Check the spelling, or search by a scent you like such as oud, rose, vanilla or musk."}
              </p>
              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {chips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={chip.remove}
                      className="min-h-0! inline-flex h-9 items-center gap-1 rounded-full border border-stone-300 bg-white pl-3 pr-2 text-[13px] font-medium text-stone-800"
                    >
                      {chip.label}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex h-10 items-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white"
                >
                  See all perfumes
                </button>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  className="inline-flex h-10 items-center rounded-full border border-stone-300 px-5 text-sm font-semibold text-stone-800"
                >
                  Ask us on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              {result.meta.relaxed && (
                <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
                  We could not find an exact match for “{state.q}”, so here are the closest perfumes.
                </p>
              )}
              <ul
                className={cn(
                  "grid grid-cols-2 gap-2 transition-opacity sm:gap-3 md:grid-cols-3 xl:grid-cols-4",
                  pending && "opacity-60"
                )}
              >
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    onClickCapture={(e) => {
                      // only clicks that open the product (not Buy now / cart / wishlist buttons)
                      if (!(e.target as HTMLElement).closest("button")) {
                        kwPushSelectItem({ listName, item, index: (result.meta.page - 1) * result.meta.limit + index });
                      }
                    }}
                  >
                    <ProductCard product={asProduct(item)} onQuickView={() => setQuickView(item)} priority={index < 4} />
                  </li>
                ))}
              </ul>

              {result.meta.totalPage > 1 && (
                <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pages">
                  {pageList(result.meta.page, result.meta.totalPage).map((p, i) =>
                    p === null ? (
                      <span key={`gap-${i}`} className="px-1 text-stone-400">
                        …
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={shopHref(basePath, { ...state, page: p }, locked)}
                        scroll={false}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(p);
                        }}
                        aria-current={p === result.meta.page ? "page" : undefined}
                        aria-label={`Page ${p}`}
                        className={cn(
                          "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold",
                          p === result.meta.page ? "bg-emerald-700 text-white" : "border border-stone-200 bg-white text-stone-800 hover:border-emerald-600"
                        )}
                      >
                        {p}
                      </Link>
                    )
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Phone filters */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="flex h-[88dvh] flex-col gap-0 rounded-t-3xl border-0 bg-white p-0">
          <SheetHeader className="shrink-0 border-b border-stone-100 px-4 py-3">
            <SheetTitle className="text-base font-bold text-stone-900">Find your scent</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">{panel}</div>
          <div className="flex shrink-0 gap-2 border-t border-stone-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={clearAll}
              disabled={activeCount === 0 && !state.q}
              className="h-11 flex-1 rounded-full border border-stone-300 text-sm font-semibold text-stone-800 disabled:opacity-40"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="h-11 flex-[2] rounded-full bg-emerald-700 text-sm font-semibold text-white"
            >
              {pending ? "Updating…" : `Show ${total} ${total === 1 ? "perfume" : "perfumes"}`}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {quickView && (
        <ProductQuickView
          product={asProduct(quickView)}
          open={!!quickView}
          onOpenChange={(open: boolean) => {
            if (!open) setQuickView(null);
          }}
        />
      )}
    </div>
  );
}

/** 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | null)[] {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const pages = Array.from(wanted).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}
