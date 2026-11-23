// Shop search + filters: shared types and URL helpers (used on the server and in the browser).
// The address bar is the single source of truth for what the shop shows, so a filtered view can be
// shared, bookmarked, indexed and restored with the back button.

export type FacetOption = { id: string; label: string; hint?: string; count: number; selected: boolean };

export const FACET_GROUPS = [
  "category",
  "families",
  "notes",
  "longevity",
  "projection",
  "occasions",
  "times",
  "seasons",
  "gender",
] as const;
export type FacetGroup = (typeof FACET_GROUPS)[number];

export type Facets = Record<FacetGroup, FacetOption[]> & {
  price: { min: number; max: number };
  inStock: number;
  onSale: number;
};

export type DiscoveryVariant = {
  id: string;
  sku?: string;
  unit?: string;
  size?: number;
  price: number;
  stock?: number;
  isDefault?: boolean;
  compareAtPrice?: number | null;
};

export type DiscoveryItem = {
  id: string;
  name: string;
  slug: string;
  primaryImage: string;
  otherImages: string[];
  accords: string[];
  variants: DiscoveryVariant[];
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  averageRating: number;
  reviewCount: number;
  discount?: { type: string; value: number } | null;
  brand: string | null;
  gender: string | null;
  category: { id: string; label: string } | null;
  families: string[];
  longevity: string | null;
  projection: string | null;
};

export type DiscoveryMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  relaxed: boolean;
  sort: SortId;
};

export type DiscoveryResponse = { data: DiscoveryItem[]; meta: DiscoveryMeta; facets: Facets };

export const SORT_OPTIONS = [
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest" },
  { id: "price_asc", label: "Price: low to high" },
  { id: "price_desc", label: "Price: high to low" },
  { id: "name", label: "Name: A to Z" },
] as const;
export type SortId = (typeof SORT_OPTIONS)[number]["id"] | "relevance";

export type ShopState = {
  q: string;
  sort: string;
  page: number;
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  onSale: boolean;
} & Record<FacetGroup, string[]>;

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined): string => (Array.isArray(v) ? v[0] ?? "" : v ?? "");
const csv = (v: string | string[] | undefined): string[] =>
  Array.from(new Set(first(v).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)));
const positive = (v: string | string[] | undefined): number | undefined => {
  const n = Number(first(v));
  return first(v) !== "" && Number.isFinite(n) && n >= 0 ? n : undefined;
};

/** Read the shop state from the address. Old links (?search=, ?specification=) still work. */
export function parseShopState(params: RawParams): ShopState {
  const state = { q: (first(params.q) || first(params.search)).trim().slice(0, 80) } as ShopState;
  for (const group of FACET_GROUPS) state[group] = csv(params[group]);
  const oldGender = first(params.specification).toLowerCase();
  if (!state.gender.length && (oldGender === "male" || oldGender === "female")) {
    state.gender = [oldGender === "male" ? "men" : "women"];
  }
  state.sort = first(params.sort);
  state.page = Math.max(1, Math.floor(positive(params.page) ?? 1));
  state.minPrice = positive(params.minPrice);
  state.maxPrice = positive(params.maxPrice);
  state.inStock = first(params.inStock) === "1" || first(params.inStock) === "true";
  state.onSale = first(params.onSale) === "1" || first(params.onSale) === "true";
  return state;
}

/** Query string for a state. `locked` values (a category page's own category) are left out. */
export function toQueryString(state: ShopState, locked: Partial<Record<FacetGroup, string[]>> = {}): string {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  for (const group of FACET_GROUPS) {
    const values = state[group].filter((v) => !(locked[group] ?? []).includes(v));
    if (values.length) p.set(group, values.join(","));
  }
  if (state.minPrice !== undefined) p.set("minPrice", String(state.minPrice));
  if (state.maxPrice !== undefined) p.set("maxPrice", String(state.maxPrice));
  if (state.inStock) p.set("inStock", "1");
  if (state.onSale) p.set("onSale", "1");
  if (state.sort) p.set("sort", state.sort);
  if (state.page > 1) p.set("page", String(state.page));
  return p.toString();
}

export const shopHref = (basePath: string, state: ShopState, locked?: Partial<Record<FacetGroup, string[]>>): string => {
  const qs = toQueryString(state, locked);
  return qs ? `${basePath}?${qs}` : basePath;
};

/** How many filters the customer has switched on (locked ones do not count). */
export function countActiveFilters(state: ShopState, locked: Partial<Record<FacetGroup, string[]>> = {}): number {
  let n = 0;
  for (const group of FACET_GROUPS) n += state[group].filter((v) => !(locked[group] ?? []).includes(v)).length;
  if (state.minPrice !== undefined || state.maxPrice !== undefined) n += 1;
  if (state.inStock) n += 1;
  if (state.onSale) n += 1;
  return n;
}

const API = process.env.NEXT_PUBLIC_API_URL;

/** Server-side fetch of a shop view. Returns null when the API cannot be reached. */
export async function fetchDiscovery(state: ShopState, limit = 24): Promise<DiscoveryResponse | null> {
  const qs = toQueryString(state);
  try {
    const res = await fetch(`${API}/discover?${qs}${qs ? "&" : ""}limit=${limit}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const body = await res.json();
    if (!body?.success || !Array.isArray(body.data)) return null;
    return { data: body.data, meta: body.meta, facets: body.facets };
  } catch {
    return null;
  }
}

export type SearchSuggestions = {
  products: {
    id: string;
    name: string;
    slug: string;
    primaryImage: string;
    minPrice: number;
    discount?: { type: string; value: number } | null;
    category: { id: string; label: string } | null;
    families: string[];
    inStock: boolean;
  }[];
  filters: { type: "family" | "note" | "occasion" | "category"; id: string; label: string; count: number }[];
  total: number;
  relaxed: boolean;
};

/** Browser-side: suggestions while typing. */
export async function fetchSuggestions(q: string, signal?: AbortSignal): Promise<SearchSuggestions | null> {
  try {
    const res = await fetch(`${API}/discover/suggest?q=${encodeURIComponent(q)}`, { signal });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}

/** Where a suggested filter leads. */
export const suggestionHref = (s: SearchSuggestions["filters"][number]): string => {
  const key = s.type === "family" ? "families" : s.type === "note" ? "notes" : s.type === "occasion" ? "occasions" : "category";
  return `/shop?${key}=${encodeURIComponent(s.id)}`;
};

export async function fetchSimilar(slug: string, limit = 8): Promise<DiscoveryItem[]> {
  try {
    const res = await fetch(`${API}/discover/similar/${encodeURIComponent(slug)}?limit=${limit}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body?.data) ? body.data : [];
  } catch {
    return [];
  }
}

export const formatTaka = (n: number): string => `৳${Math.round(n).toLocaleString("en-US")}`;
