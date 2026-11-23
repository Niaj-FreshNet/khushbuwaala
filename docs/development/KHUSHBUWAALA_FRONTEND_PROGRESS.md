# Khushbuwaala Storefront — Progress

**Last updated:** 2026-11-23 (session 1)
**Spec:** `Khusbuwaala_Storefront_Master_Development_Prompt.md` (same folder)
**Related:** [TASKS](KHUSHBUWAALA_FRONTEND_TASKS.md) · [DECISIONS](KHUSHBUWAALA_FRONTEND_DECISIONS.md) · admin/backend history: `D:\Projects\khushbuwaala\KHUSHBUWAALA_*.md`

## Overall status

Phase 0 (audit) done. Phase 1 (product discovery, wishlist, SEO foundations) **built and verified locally, not deployed**.
Nothing on the live site, live API or live database was changed in this session (only public GET requests were made to read the catalogue).

| Repo | Branch | State |
|---|---|---|
| backend | `main` | 2 local commits ahead of `origin/main` (`eea04eb` + ids lookup), not pushed |
| storefront | `main` | 1 local commit ahead of `origin/main`, not pushed |
| admin | `main` | untouched |

## Deploy order (needs the owner's go-ahead; nothing here is live yet)

1. **Backend first.** `git pull`, build, `pm2 restart` as usual (memory: deployment flow). New routes `/api/discover*` and `/api/wishlist*` are additive; the only change to an existing response is that `supplier` is now `null` in public product responses and a `profile` field is added.
2. On the server, create the wishlist unique index once: `npx prisma db push` **is not safe to run blindly** on this database (it would try to sync every index). Instead create just this one index with a small script: `db.wishlist_items.createIndex({ userId: 1, productId: 1 }, { unique: true })`. First check the collection has no repeats (it has never been written by any API, so it should be empty). The code works without the index; the index only closes a double-tap race.
3. **Then the storefront** (`deploy-storefront.sh`). It needs the new backend routes: if it is deployed first, shop pages show a "could not load" message instead of products.
4. After deploy: smoke script, then check `/shop`, a filtered URL, one product page, `/wishlist`, `/sitemap.xml` (should list ~155 URLs incl. 135 products).

## What was found (audit, 2026-11-23)

Live-site facts measured this session:

- **Sitemap listed 0 products** (it called an API address that does not exist). Home and shop HTML contained **0 product links** (products were drawn only in the browser), so search engines saw empty pages.
- Product pages: meta description contained raw HTML tags; title was doubled ("… | Khushbuwaala | Khushbuwaala"); no Product structured data; link-preview images pointed to files that do not exist (404).
- Shop filters did not match the data: options such as "Corporate", "Manly", "Refreshing" exist on no product; price sorting only sorted inside one page of 20; "Z–A" and "A–Z" did the same thing; "On sale" sorted by price.
- Search looked only at name/description/brand/origin, exact letters only. "savage", "oudh", "গোলাপ" found nothing useful.
- Product page showed **invented figures**: "4–6 Hours", "7–9 Feet", and because of a typo in the code (`A_Z` for `A-Z`) *every* product showed "Moderate 4–6 Hours" regardless of its real value. A product with no reviews showed a **5.0** rating. A trust block showed "99% Satisfaction" and "4.8/5 Customer rating" (the whole catalogue has 4 published reviews).
- **Wishlist was device-only**: the backend had no wishlist API at all (the storefront called 4 addresses that returned 404). The heart button was only visible on mouse hover, so phone users never saw it.
- Public product API exposed the internal **supplier** name of every product.
- Pinch-zoom was disabled site-wide (to hide that inputs were 13px and made iPhones zoom).
- Catalogue (135 published products): fragrance data is rich but typed freely: 135/135 have accords, 134 have notes, all have longevity + projection, but e.g. "best for" has ~200 different spellings and accords include "Oud", "Oud.", "Oud (Agarwood)", "Oud/Woody".
- Tracking: one clean dataLayer → GTM (`GTM-KDFMX5QL`) design already exists for view_item, add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase (with event ids and a purchase once-only guard). Missing: view_item_list, select_item, search, add_to_wishlist, remove_from_cart, view_cart. `item_category` sent the category's database id.

## What was built

### Backend (`khushbuwaala-backend`)
- **Discovery module** (`src/modules/Discovery/`): `taxonomy.ts` (18 scent families, 38 notes, occasions, day/evening, weather, plain-word longevity/projection labels, search synonyms incl. Banglish and Bangla), `normalize.ts` (turns each product's hand-typed data into structured ids; nothing is invented), `engine.ts` (search with typo tolerance, combined filters, live counts per option, sorting across the whole catalogue, suggestions, similar products), service with a 60-second in-memory list refreshed after any product change.
- Routes: `GET /api/discover` (q, category, families, notes, longevity, projection, occasions, times, seasons, gender, minPrice, maxPrice, inStock, onSale, ids, sort, page, limit), `/api/discover/suggest`, `/api/discover/similar/:slug`, `/api/discover/sitemap`.
- Product detail response gains `profile` (families, main families, notes, longevity, projection, occasions…). `supplier` removed from public responses.
- **Wishlist module** (`src/modules/Wishlist/`): `GET/POST/DELETE /api/wishlist`, `POST /api/wishlist/merge`, `DELETE /api/wishlist/:productId`. Signed-in user only, user id always from the token, input ids validated, max 200, hidden products kept but flagged unavailable.
- Tests: 14 new (`tests/discovery.test.ts`) on a snapshot of the real public catalogue (`tests/fixtures/catalog.json`).

### Storefront (`khushbuwaala-frontend`)
- **Shop + all 10 collection pages** are now server-rendered from one component (`components/Modules/Shop/ShopListing.tsx` + `ShopView.tsx` + `FilterPanel.tsx`), configured in `src/config/collections.ts`. The address bar holds the whole filter state (shareable, back button works). Phone: bottom sheet with live counts and a "Show N perfumes" button; desktop: sidebar. Applied-filter chips, clear all, result count, typo/“closest match” notice, helpful empty state, real page links.
- Product card: heart always visible (bigger tap target), shows the product's main scent families.
- **Wishlist**: works for guests (device), syncs to the account after login (`components/Shared/WishlistSync.tsx`), new wishlist page with fresh prices/stock and a "No longer available" section. Fixed a hydration error it caused in the header.
- **Product page**: honest longevity/projection wording (no hours/feet), empty note rows hidden, no default 5.0 rating, no "99% / 4.8" tiles, HTML descriptions shown as clean text, breadcrumb now links to the real collection.
- **SEO**: sitemap with every product and stocked collection; correct titles; clean meta descriptions; Product structured data (price range, availability, rating only when real reviews exist); canonical URLs; filtered/search/empty pages are `noindex`; robots.txt keeps private pages out; link-preview image fixed; pinch-zoom restored.
- **Tracking helpers** added to `src/lib/Analytics/kwEcom.ts`: view_item_list, select_item, search, add_to_wishlist (wired); remove_from_cart, view_cart (written, not yet called from the cart).

## Tests performed (all local)

| Check | Result |
|---|---|
| Backend `npx tsc --noEmit` | pass, 0 errors |
| Backend `npm run lint` (strict, 0 warnings allowed) | pass |
| Backend `npm test` | **57/57 pass** (43 existing + 14 new) |
| Backend scratch build (`tsc --outDir`) | pass |
| Storefront `next build` (Next 16.2.11) | pass, 41 static pages + dynamic routes |
| Storefront `npx tsc --noEmit` | 51 errors, **all pre-existing** (was 100 before this session; none in new or changed code paths). Build has `ignoreBuildErrors: true` |
| Storefront lint | **not run**: the `lint` script is `next lint`, which Next 16 removed |
| Browser, phone 375×812 | shop, filter sheet (Sweet + Oud → 22, counts update, URL updates), typo search ("savage" → Dior Sauvage), wishlist add/list, signed-in merge; 0 px sideways overflow |
| Browser, desktop 1280×800 | shop with sidebar, 5 combined filters → 24 results (matches the backend test) |
| dataLayer | view_item_list, search, add_to_wishlist pushed once each with event ids |
| Server HTML (curl) | 24 product links on /shop; product page title/description/canonical/Product JSON-LD correct; sitemap 155 URLs (135 products); empty collections noindex |

How the new backend code was exercised without the database (the live database is only reachable from the server): a local stand-in API ran the **real** new routers/controllers/services against a snapshot of the public catalogue with an in-memory fake of the four Prisma calls they use, and passed every other GET through to the live public API. It refuses all non-GET requests, so no order or data change was possible.

## Not verified / not done

- Nothing was tested against the real database (wishlist writes, discovery list building from Prisma). The Prisma queries are simple (`findMany`, `createMany`, `deleteMany`) but have only run against the fake.
- GTM container, GA4, Meta Events Manager, Search Console, Merchant Center: **no access, not inspected**. New events reach the dataLayer; whether GTM forwards them needs tags/triggers for `view_item_list`, `select_item`, `search`, `add_to_wishlist` (see TASKS).
- No real device testing; no Lighthouse / Core Web Vitals run yet.
- Checkout, cart, order flow: not changed, not re-tested this session.

## Next exact action

1. Owner: review and approve deploy (order above), answer the questions in TASKS ("Owner questions").
2. Then continue with TASKS P1: search drawer on the new suggest API → product page "similar scents" + profile block → home page product sections server-rendered → cart hydration fix.
