"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Loader2, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { fetchSuggestions, formatTaka, suggestionHref, type SearchSuggestions } from "@/lib/discovery";

interface SearchDrawerProps {
  visible: boolean;
  onClose: () => void;
}

// Ways into the collection for someone who does not know a perfume's name yet.
// Each is an ordinary shop link, so it always shows whatever is in stock for it.
const STARTING_POINTS: { label: string; href: string }[] = [
  { label: "Something fresh", href: "/shop?families=fresh" },
  { label: "Sweet", href: "/shop?families=sweet" },
  { label: "Woody", href: "/shop?families=woody" },
  { label: "With oud", href: "/shop?notes=oud" },
  { label: "With rose", href: "/shop?notes=rose" },
  { label: "Musk", href: "/shop?notes=musk" },
  { label: "Lasts all day", href: "/shop?longevity=long,very_long" },
  { label: "For the office", href: "/shop?occasions=office" },
  { label: "Under ৳500", href: "/shop?maxPrice=500" },
  { label: "Gift sets", href: "/gifts-and-packages" },
];

const RECENT_KEY = "kw_recent_searches";
const FILTER_KIND: Record<SearchSuggestions["filters"][number]["type"], string> = {
  family: "Scent family",
  note: "Note",
  occasion: "Occasion",
  category: "Collection",
};

const readRecent = (): string[] => {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(list) ? list.filter((s) => typeof s === "string").slice(0, 6) : [];
  } catch {
    return [];
  }
};

const priceOf = (p: SearchSuggestions["products"][number]): number => {
  const d = p.discount;
  if (!d || typeof d.value !== "number") return p.minPrice;
  if (d.type === "percentage") return Math.max(0, Math.round(p.minPrice * (1 - d.value / 100)));
  if (d.type === "fixed") return Math.max(0, Math.round(p.minPrice - d.value));
  return p.minPrice;
};

export default function SearchDrawer({ visible, onClose }: SearchDrawerProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<SearchSuggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  const query = text.trim();

  useEffect(() => {
    if (!visible) return;
    setRecent(readRecent());
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [visible]);

  // Suggestions while typing: a short pause, and an older answer never overwrites a newer one.
  useEffect(() => {
    if (!visible || query.length < 2) {
      setResult(null);
      setLoading(false);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await fetchSuggestions(query, controller.signal);
      if (controller.signal.aborted) return;
      setResult(data);
      setFailed(data === null);
      setLoading(false);
    }, 220);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, visible]);

  const remember = (q: string) => {
    if (!q) return;
    try {
      const next = [q, ...readRecent().filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // private mode: recent searches are simply not kept
    }
  };

  const close = () => {
    onClose();
    setText("");
  };

  const seeAll = (q: string) => {
    if (!q) return;
    remember(q);
    close();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  const clearRecent = () => {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // nothing to clear
    }
    setRecent([]);
  };

  return (
    <Sheet open={visible} onOpenChange={(open) => !open && close()}>
      <SheetContent side="top" className="flex h-[100dvh] flex-col gap-0 border-0 bg-white p-0 sm:h-auto sm:max-h-[85vh]">
        <SheetHeader className="sr-only">
          <SheetTitle>Search perfumes</SheetTitle>
        </SheetHeader>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            seeAll(query);
          }}
          className="flex shrink-0 items-center gap-2 border-b border-stone-200 px-3 py-3 pr-16 sm:px-6 sm:pr-16"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Perfume name, or a scent you like"
              aria-label="Search perfumes"
              className="h-11 w-full rounded-full border border-stone-300 bg-white pl-10 pr-10 text-base! text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {text && (
              <button
                type="button"
                onClick={() => {
                  setText("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="min-h-0! absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6">
          {query.length < 2 ? (
            <div className="space-y-6">
              {recent.length > 0 && (
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Your recent searches</h2>
                    <button type="button" onClick={clearRecent} className="min-h-0! text-xs font-medium text-stone-500 underline underline-offset-2">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => seeAll(r)}
                        className="min-h-0! inline-flex h-9 items-center gap-1.5 rounded-full border border-stone-200 px-3 text-[13px] text-stone-800"
                      >
                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                        {r}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Not sure of the name? Start here</h2>
                <div className="flex flex-wrap gap-1.5">
                  {STARTING_POINTS.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={close}
                      className="inline-flex h-9 items-center rounded-full bg-stone-100 px-3.5 text-[13px] font-medium text-stone-800 hover:bg-emerald-50 hover:text-emerald-900"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
                <p className="mt-3 text-xs text-stone-500">
                  You can type in English or Bangla: “oud”, “golap”, “মিষ্টি”, “long lasting”…
                </p>
              </section>
            </div>
          ) : failed ? (
            <p className="py-8 text-center text-sm text-stone-600">
              Search is not responding right now.{" "}
              <button type="button" onClick={() => seeAll(query)} className="min-h-0! font-semibold text-emerald-800 underline underline-offset-2">
                Open the shop with “{query}”
              </button>
            </p>
          ) : !result ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching…
            </div>
          ) : result.products.length === 0 && result.filters.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-stone-900">Nothing found for “{query}”</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-stone-600">
                Check the spelling, or try a scent instead of a name: oud, rose, vanilla, musk.
              </p>
            </div>
          ) : (
            <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
              {result.filters.length > 0 && (
                <section className="mb-5">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Browse by</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {result.filters.map((f) => (
                      <Link
                        key={`${f.type}:${f.id}`}
                        href={suggestionHref(f)}
                        onClick={() => {
                          remember(query);
                          close();
                        }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-[13px] font-medium text-emerald-900"
                      >
                        {f.label}
                        <span className="text-[11px] font-normal text-emerald-700">
                          {FILTER_KIND[f.type]} · {f.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {result.products.length > 0 && (
                <section>
                  <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {result.relaxed ? "Closest matches" : "Perfumes"}
                  </h2>
                  <ul className="divide-y divide-stone-100">
                    {result.products.map((p) => {
                      const price = priceOf(p);
                      return (
                        <li key={p.id}>
                          <Link
                            href={`/product/${p.slug}`}
                            onClick={() => {
                              remember(query);
                              close();
                            }}
                            className="flex items-center gap-3 py-2.5"
                          >
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                              <Image src={p.primaryImage} alt="" fill sizes="56px" className="object-cover" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-stone-900">{p.name}</span>
                              <span className="block truncate text-xs text-stone-500">
                                {[p.category?.label, p.families.slice(0, 3).join(" · ")].filter(Boolean).join(" — ")}
                              </span>
                            </span>
                            <span className="shrink-0 text-right">
                              <span className="block text-sm font-semibold text-stone-900">from {formatTaka(price)}</span>
                              {!p.inStock && <span className="block text-[11px] text-stone-500">Out of stock</span>}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>

        {query.length >= 2 && result && result.total > 0 && (
          <div className="shrink-0 border-t border-stone-100 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
            <button
              type="button"
              onClick={() => seeAll(query)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-700 text-sm font-semibold text-white"
            >
              See all {result.total} {result.total === 1 ? "result" : "results"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
