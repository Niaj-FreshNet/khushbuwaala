import type { Metadata } from "next";
import Link from "next/link";
import {
  countActiveFilters,
  fetchDiscovery,
  parseShopState,
  shopHref,
  type FacetGroup,
  type ShopState,
} from "@/lib/discovery";
import { siteConfig } from "@/config/site";
import { ShopView } from "./ShopView";

export type ShopSearchParams = Promise<Record<string, string | string[] | undefined>>;

export type ShopListingConfig = {
  /** Address of the page, e.g. "/shop" or "/artificial-oud" */
  basePath: string;
  /** Page heading (the only h1) */
  heading: string;
  /** One or two honest sentences under the heading */
  intro: string;
  /** Browser title and search-result description */
  title: string;
  description: string;
  /** Filters this page always applies (a collection page locks its category) */
  locked?: Partial<Record<FacetGroup, string[]>>;
  /** Sort used when the customer has not picked one */
  defaultSort?: string;
};

const PAGE_SIZE = 24;

const resolveState = async (config: ShopListingConfig, searchParams: ShopSearchParams): Promise<ShopState> => {
  const state = parseShopState(await searchParams);
  for (const [group, values] of Object.entries(config.locked ?? {})) {
    const key = group as FacetGroup;
    state[key] = Array.from(new Set([...(values ?? []), ...state[key]]));
  }
  if (!state.sort && config.defaultSort) state.sort = config.defaultSort;
  return state;
};

/** Title, description, canonical and index rules for a shop or collection page. */
export async function shopMetadata(config: ShopListingConfig, searchParams: ShopSearchParams): Promise<Metadata> {
  const state = await resolveState(config, searchParams);
  const filtered = countActiveFilters(state, config.locked) > 0 || state.q !== "";
  const pageSuffix = state.page > 1 ? ` – Page ${state.page}` : "";
  const canonical = `${siteConfig.url}${config.basePath}${state.page > 1 && !filtered ? `?page=${state.page}` : ""}`;
  // A collection with nothing in it yet is not worth a search result (same request as the page makes,
  // so it is answered from the cache).
  const result = filtered ? null : await fetchDiscovery(state, PAGE_SIZE);
  const empty = result !== null && result.meta.total === 0;

  return {
    title: { absolute: `${config.title}${pageSuffix} | ${siteConfig.name}` },
    description: config.description,
    alternates: { canonical },
    // Filtered and searched views are for people, not for the index: they would be thousands of
    // near-identical pages. The plain collection pages (and their pages 2, 3…) are indexed.
    robots: filtered || empty ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: `${config.title} | ${siteConfig.name}`,
      description: config.description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}

export async function ShopListing({ config, searchParams }: { config: ShopListingConfig; searchParams: ShopSearchParams }) {
  const state = await resolveState(config, searchParams);
  const result = await fetchDiscovery(state, PAGE_SIZE);
  const filtered = countActiveFilters(state, config.locked) > 0 || state.q !== "";

  // What the page looks like before the customer touches anything (sort is implied, not in links)
  const linkState = { ...state, sort: state.sort === config.defaultSort ? "" : state.sort };

  const offset = result ? (result.meta.page - 1) * result.meta.limit : 0;
  const structuredData = result && {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.heading,
    description: config.description,
    url: `${siteConfig.url}${config.basePath}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: result.meta.total,
      itemListElement: result.data.map((p, i) => ({
        "@type": "ListItem",
        position: offset + i + 1,
        url: `${siteConfig.url}/product/${p.slug}`,
        name: p.name,
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        ...(config.basePath === "/shop"
          ? [{ "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.url}/shop` }]
          : [
              { "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.url}/shop` },
              { "@type": "ListItem", position: 3, name: config.heading, item: `${siteConfig.url}${config.basePath}` },
            ]),
      ],
    },
  };

  const emptyCollection = result && result.meta.total === 0 && !filtered;

  return (
    <div className="bg-white pb-8">
      {structuredData && !filtered && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
      {/* Plain links so search engines can walk the pages even without JavaScript */}
      {result && !filtered && result.meta.page > 1 && (
        <link rel="prev" href={shopHref(config.basePath, { ...linkState, page: result.meta.page - 1 }, config.locked)} />
      )}
      {result && !filtered && result.meta.page < result.meta.totalPage && (
        <link rel="next" href={shopHref(config.basePath, { ...linkState, page: result.meta.page + 1 }, config.locked)} />
      )}

      <header className="container mx-auto px-3 pb-3 pt-4 sm:px-4 sm:pt-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{config.heading}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-[15px]">{config.intro}</p>
      </header>

      {emptyCollection ? (
        <div className="container mx-auto px-3 sm:px-4">
          <div className="rounded-2xl border border-stone-200 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-stone-900">Nothing is listed in this collection right now</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-stone-600">
              We are still adding to it. Meanwhile, the full collection has plenty to explore, and you can filter it by
              the kind of scent you like.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex h-10 items-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white"
            >
              Browse all perfumes
            </Link>
          </div>
        </div>
      ) : (
        <ShopView
          basePath={config.basePath}
          listName={config.heading}
          state={linkState}
          locked={config.locked}
          result={result}
        />
      )}
    </div>
  );
}
