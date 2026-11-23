// Content the shop owner edits in the admin panel (Storefront → Home page content): the
// announcement bar, the hero banners and the product rows on the home page.
// Read on the server and refreshed every minute. If the API cannot be reached, the built-in
// defaults below are used, so the shop never renders without a hero or product rows.

export type HeroSlide = { image: string; mobileImage?: string; alt: string; buttonText: string; link: string };
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
