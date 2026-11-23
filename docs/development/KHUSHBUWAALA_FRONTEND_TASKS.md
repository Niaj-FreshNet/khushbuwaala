# Khushbuwaala Storefront — Task Checklist

Legend: `[x]` done and verified locally · `[~]` built, not fully verified · `[ ]` not started · `[!]` blocked · `[?]` needs the owner
**Last updated:** 2026-11-23 (session 1). "Verified" means locally (build + browser + tests); nothing is deployed yet.

## Deploy (blocked on owner approval)
- [!] **P0** Deploy backend, create the wishlist unique index, then deploy storefront (steps in PROGRESS). Depends on: owner go-ahead.
- [ ] **P0** After deploy: verify discovery and wishlist against the real database; run the smoke script; check sitemap in the browser.

## Owner questions
- [?] **How long has Khushbuwaala been in business?** The site says "Since 2020 / 6+ years of trust" (`components/Modules/Product/TrustSignals.tsx`); the brief says about 8 years in the fragrance trade. Tell me the wording you want and I will make it consistent everywhere.
- [?] About page shows "10K+ Happy Customers" and "50+ Fragrance Brands"; footer shows "Facebook 10K+ / Instagram 15K+ / YouTube 8K+". Are these real? If not sure, I will remove them.
- [?] `/accessories` and `/niche-perfumes` have no products (no such category in the admin). Keep the pages (they now show a friendly note and are hidden from Google) or remove them from the menu?
- [?] "Organic Attar" in the menu now shows the admin category **NATURAL ATTAR OIL** (3 products). Is that the right match?
- [?] One published blog post is placeholder text ("Est dolor velit do"). Unpublish it in the admin, or shall I leave blog posts out of the sitemap?
- [?] Access for tracking checks: GTM (GTM-KDFMX5QL), GA4, Meta Events Manager, Search Console, Merchant Center. Without it I can only verify what the site sends, not what arrives.
- [?] Google Search Console verification code (the placeholder was removed from the page head).

## P1 — Product discovery
- [x] Structured families / notes / occasions / longevity / projection derived from existing product data — backend `modules/Discovery/taxonomy.ts`, `normalize.ts`; tests
- [x] Search: partial words, typos, Banglish, Bangla, filler words ignored — `engine.ts`; tests + browser
- [x] Combined filters with live counts, correct sorting, pagination — tests + browser (phone + desktop)
- [x] Shop + collection pages rebuilt, URL-driven, server-rendered — `components/Modules/Shop/*`, `config/collections.ts`
- [x] Empty and "closest match" states
- [x] Header search rebuilt on the suggestions API (`components/Modules/Search/SearchDrawer.tsx`): scent/note/collection shortcuts, product rows, the customer's own recent searches, English/Banglish/Bangla. Removed hard-coded fake "recent searches" and misspelt smell tags — browser-checked on phone ("golap" → Rose, Floral, 67 results)
- [~] Similar products API (`/discover/similar/:slug`) — built + unit-tested; product page still uses the old "related" list
- [ ] Use `profile` on the product page: a "Scent at a glance" block (main families with plain hints, occasions) linking to the matching shop filters
- [ ] Discovery landing pages for strong intents (e.g. /shop?families=…) with their own indexable URLs and copy: only where enough products exist
- [ ] Admin: manage taxonomy aliases/synonyms without a code change (today: edit `taxonomy.ts`). Admin can already edit each product's accords, notes, longevity, projection, best-for
- [ ] Admin: data clean-up helper (list values that match no family/note so staff can fix spellings)
- [ ] Price filter: only quick budgets today; add a min–max range if customers ask

## P1 — Wishlist
- [x] Backend API with ownership, validation, duplicates prevented — `modules/Wishlist/*`
- [x] Guest wishlist on device; merge into account after login — `WishlistSync.tsx`, `useWishlist.ts`
- [x] Card + quick view hearts; wishlist page with fresh data, unavailable items, empty/loading/error states
- [x] add_to_wishlist tracking
- [ ] Heart on the product detail page itself (only cards / quick view have it)
- [ ] Verify against the real database after deploy

## P1 — Product detail page
- [x] No invented hours/feet/ratings; clean descriptions; empty notes hidden; breadcrumb fixed
- [x] Title, description, canonical, Product structured data
- [ ] Gallery: thumbnails render blank until loaded (seen on live); check image sizes/zoom on phones
- [ ] Delivery/payment info near the buy buttons; review block wording
- [ ] `generateStaticParams` for the best sellers so first visits from ads are instant

## P1 — Performance
- [ ] **Cart state loads from the browser at start-up** (`features/cart/cartSlice.ts`), which makes React rebuild the whole page for anyone with items in the cart (same bug fixed for the wishlist). Needs care: checkout reads the cart immediately
- [ ] Home page product carousels are browser-rendered: move first section to the server
- [ ] `public/` holds 11 MB of unused PNG hero images; hero images are not sized per device
- [ ] Lighthouse / Core Web Vitals baseline on phone (not measured yet)
- [ ] Remove unused heavy packages (jodit, recharts, react-color, html2pdf are admin leftovers?) after checking imports

## P1 — Tracking
- [x] view_item_list, select_item, search, add_to_wishlist pushed with event ids
- [x] item_category on view_item is now the category name
- [ ] Call `kwPushRemoveFromCart` / `kwPushViewCart` from the cart drawer and cart page
- [ ] `item_category` in add_to_cart on cards still falls back to an id for old list shapes
- [!] GTM: add triggers/tags for the new events (GA4 + Meta Search / AddToWishlist). Blocked: no GTM access
- [!] Verify Pixel + CAPI de-duplication and purchase-once in Events Manager. Blocked: no access

## P1 — Checkout / cart (not touched yet)
- [ ] Full audit pass of cart → checkout → thank-you on phone, against backend rules (was last fixed 2026-11-22 for coupon display)

## P2 — SEO
- [x] Sitemap, robots, canonicals, noindex rules, titles, link-preview image
- [ ] Organization data: `sameAs` links and opening hours are unverified guesses in `app/layout.tsx`; confirm or remove
- [ ] Product descriptions: 42 of 135 are Bangla, the rest English; decide a consistent pattern (not blocking)
- [ ] `metaTitle` / `metaDescription` are empty on all 135 products: the page now falls back sensibly, admin can fill them
- [ ] Google Shopping feed review (1.8 MB feed exists at `/api/products/google-shopping-feed.xml`)
- [ ] `proxy.ts` still redirects signed-in admins to `/dashboard`, which no longer exists

## P2 — Admin manageability
- [ ] Homepage banners, announcement bar, featured sections, footer/contact from the admin (today hard-coded)
- [ ] Collections config (`config/collections.ts`) editable from the admin

## P2 — Brand / content
- [ ] Brand story and "about" rewritten once the owner confirms the facts above
- [ ] Remove leftover admin files from the storefront (`config/nav.ts`, `navLink.ts`, expense/sales/stock API slices, `lib/Data/data.ts`)

## Housekeeping
- [ ] Storefront lint script (`next lint` no longer exists in Next 16) → `eslint src`
- [ ] 51 pre-existing type errors; `ignoreBuildErrors: true` hides them at build
