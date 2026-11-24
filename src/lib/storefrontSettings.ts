// Content the shop owner edits in the admin panel (Storefront → Home page content): the
// announcement bar, the hero banners and the product rows on the home page.
// Read on the server and refreshed every minute. If the API cannot be reached, the built-in
// defaults below are used, so the shop never renders without a hero or product rows.

export type HeroSlide = {
  image: string;
  mobileImage?: string;
  /** Pixel size of the pictures as uploaded (absent on banners saved before sizes were recorded). */
  imageWidth?: number;
  imageHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  alt: string;
  /** Empty = no button; the whole banner is the link. */
  buttonText: string;
  link: string;
};

// The banner box takes the shape of the FIRST banner's pictures, so a picture made to the advised
// size (or any size close to it) is shown whole. The shape is kept inside a sensible range: a very
// tall picture would push the products off the first screen, a very flat one would be a sliver.
// Keep in step with the admin panel's copy (src/lib/heroShape.ts there), which previews the same box.
export const HERO_SHAPE = {
  // Wide and short on purpose: on a computer the banner must leave the first product row on
  // the first screen (a 2.2:1 banner at full page width was about 660px tall on a 1920 screen).
  desktop: { min: 2.8, max: 3.4, fallback: 2.9 },
  phone: { min: 0.8, max: 2.4, fallback: 1 },
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const ratio = (w?: number, h?: number) => (w && h && w > 0 && h > 0 ? w / h : null);

/** Width ÷ height of the banner box on phones and on wider screens. */
export function heroBoxShape(slides: HeroSlide[]): { phone: number; desktop: number } {
  const first = slides[0];
  const wide = first ? ratio(first.imageWidth, first.imageHeight) : null;
  // without a separate phone picture, phones show the wide one
  const narrow = first?.mobileImage ? ratio(first.mobileWidth, first.mobileHeight) : wide;
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return {
    desktop: round(wide ? clamp(wide, HERO_SHAPE.desktop.min, HERO_SHAPE.desktop.max) : HERO_SHAPE.desktop.fallback),
    phone: round(narrow ? clamp(narrow, HERO_SHAPE.phone.min, HERO_SHAPE.phone.max) : HERO_SHAPE.phone.fallback),
  };
}
export type HomeRow = { title: string; query: string; href: string; linkLabel: string; enabled: boolean };
export type StorefrontSettings = { notices: string[]; hero: HeroSlide[]; homeRows: HomeRow[] };

// Keep in step with the backend's DEFAULT_SETTINGS (src/modules/Storefront/storefront.settings.ts).
export const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettings = {
  notices: ["Free shipping on orders over ৳1000", "Premium Quality, Authentic Products", "Cash on Delivery Available"],
  hero: [
    { image: "/hero1desktop11.webp", mobileImage: "/hero1mobile11.webp", alt: "Khushbuwaala perfume oils", buttonText: "Shop Now", link: "/shop" },
    { image: "/hero2desktop22.webp", mobileImage: "/hero2mobile22.webp", alt: "Khushbuwaala attars and oud", buttonText: "Explore Collections", link: "/shop" },
    { image: "/hero3desktop33.webp", mobileImage: "/hero3mobile33.webp", alt: "Khushbuwaala attars and oud", buttonText: "Best Sellers", link: "/shop?sort=popular" },
  ],
  homeRows: [
    { title: "Best Sellers", query: "sort=popular&inStock=1", href: "/shop", linkLabel: "See all perfumes", enabled: true },
    { title: "Arabian Attar", query: "category=oriental-attar&inStock=1", href: "/oriental-attar", linkLabel: "All Arabian attar", enabled: true },
    { title: "Oud Collection", query: "category=artificial-oud&inStock=1", href: "/artificial-oud", linkLabel: "All oud", enabled: true },
    { title: "Inspired Perfume Oils", query: "category=inspired-perfume-oil&inStock=1", href: "/inspired-perfume-oil", linkLabel: "All inspired oils", enabled: true },
    { title: "New Arrivals", query: "sort=newest&inStock=1", href: "/new-arrivals", linkLabel: "All new arrivals", enabled: true },
  ],
};

export async function getStorefrontSettings(): Promise<StorefrontSettings> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storefront/settings`, {
      next: { revalidate: 60, tags: ["storefront-settings"] },
    });
    if (!res.ok) return DEFAULT_STOREFRONT_SETTINGS;
    const body = await res.json();
    const s = body?.data?.settings;
    if (!s || !Array.isArray(s.hero) || !Array.isArray(s.homeRows)) return DEFAULT_STOREFRONT_SETTINGS;
    return {
      notices: Array.isArray(s.notices) ? s.notices : DEFAULT_STOREFRONT_SETTINGS.notices,
      hero: s.hero.length ? s.hero : DEFAULT_STOREFRONT_SETTINGS.hero,
      homeRows: s.homeRows.length ? s.homeRows : DEFAULT_STOREFRONT_SETTINGS.homeRows,
    };
  } catch {
    return DEFAULT_STOREFRONT_SETTINGS;
  }
}
