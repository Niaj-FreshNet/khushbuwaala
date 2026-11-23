# Khushbuwaala Storefront — Progress

**Last updated:** 2026-11-23 (session 2)
**Spec:** `Khusbuwaala_Storefront_Master_Development_Prompt.md` (same folder)
**Related:** [TASKS](KHUSHBUWAALA_FRONTEND_TASKS.md) · [DECISIONS](KHUSHBUWAALA_FRONTEND_DECISIONS.md) · admin/backend history: `D:\Projects\khushbuwaala\KHUSHBUWAALA_*.md`

## Overall status

Phase 0 (audit) done. Phase 1 (product discovery, header search, wishlist, SEO foundations) is **live since 2026-11-23 ~15:30 Dhaka** (owner approved the deploy).

## Session 2 — 2026-11-23 (owner decisions, product page, tracking audit) — DEPLOYED

**Live now:** backend `387aa8f`, storefront `e4036bb`. Rollback copies in `~/deploy-backups`: `backend-dist-20261123-103700` and `-103827`, `storefront-next-20261123-103237`.

**Owner decisions applied**
- Wording: "Khushbuwaala since 2020" and "8+ years in fragrance", never "8 years in business". About page rewritten around it (no counts, no awards, no certifications).
- Removed: 10K+ customers, 50+ brands, 20+ team, Facebook/Instagram/YouTube follower counts.
- Niche Perfumes and Accessories: out of the desktop menu, phone menu and home category grid; pages kept, friendly empty state, `noindex`, not in the sitemap.
- "Organic Attar" is shown as **Natural Attar** (same address `/organic-attar`, admin category NATURAL ATTAR OIL): no organic certification is claimed anywhere.
- Placeholder blog post unpublished in the live database (not deleted; copy at `~/deploy-backups/blog-before-unpublish-1795429540854.json`). The public blog API returns 0 posts; `/blog` is `noindex` and out of the sitemap while it has no articles; a missing/unpublished article page is `noindex`.
- Search Console: the domain already has a DNS record `google-site-verification=IdRaZ…`, so a Domain property can be (or already is) verified by DNS. No verification tag was added to the pages. Whether the property is verified inside Search Console could not be checked (no account access).

**Product page**
- "<name> at a glance": main scent families with plain-word hints, notes, strength, occasions; every item links into the matching shop filter. Server-rendered.
- "If you like <name>": 8 perfumes that share notes and families, from the discovery API, server-rendered (the old block was browser-only and showed a random mix).
- Wishlist heart on the product photo.

**Tracking (code)**
- New events wired: `view_cart` (cart page and cart drawer), `remove_from_cart`.
- Every event now sends the category **name** ("Inspired Perfume Oil") instead of a database id; one helper builds cart items for all cart events.
- Server-side Meta Purchase (backend → Meta directly): phone now sent with country code (8801…), first/last name split, country hashed, and a refusal from Meta is logged (it used to fail silently). Covered by 4 unit tests.
- Header cart count no longer makes React rebuild the page for visitors with items in the cart.

**Google Shopping feed** (`/api/products/google-shopping-feed.xml`, 993 items) — fixed and verified live:
- `age_group` was the "best for" list ("Office, Party…"), which Google rejects → `adult`.
- Links pointed at `/products/…` (a redirect) → `/product/…`.
- Hidden sizes were included → only sizes on sale.
- Inspired oils were listed under the designer's brand (e.g. Tom Ford) → Khushbuwaala; real brand kept for brand perfumes.
- `identifier_exists=no` added where there is no barcode.

**Tests / checks this session**
- Backend: tsc 0 errors, lint 0, **62/62** tests. Storefront: build OK; type errors 51 → 41 (all pre-existing).
- Live after deploy: 12 key pages 200; **135/135 product pages 200**; sitemap 153 URLs (135 products, 0 blog, 0 empty collections); product page has 8 similar-product links and filter links in its HTML; feed re-read: 993/993 items with valid age group, final links, identifier flag.
- Browser (local build against a write-blocked stand-in API): view_item → add_to_cart → view_cart → remove_from_cart each fired once with event id, value 450 and category name; no hydration error with an item in the cart.
- Live wishlist write test (owner approved): 13/13, test customer removed.

## Tracking audit — what is and is not verified (2026-11-23)

| Item | Verified in code | Verified in the browser | Verified in the vendor's dashboard |
|---|---|---|---|
| GTM web container `GTM-KDFMX5QL` loads | yes (`app/layout.tsx`) | yes | no access |
| dataLayer events: view_item_list, select_item, view_item, add_to_cart, view_cart, remove_from_cart, begin_checkout, add_shipping_info, add_payment_info, purchase, search, add_to_wishlist | yes | view_item_list, search, add_to_wishlist, view_item, add_to_cart, view_cart, remove_from_cart seen with ids and values; **checkout and purchase events not exercised** (no test order was placed) | no access |
| GA4 `G-TLLSPJHM9W` tags in the public container | — | container has GA4 event tags for page_view, view_item, select_item, add_to_cart, begin_checkout, purchase only | no access |
| GA4 delivery | — | **failing**: hits go to `sgtm.khushbuwaala.com`, which returns 503 | no access |
| Meta Pixel (browser) tags in the container | — | PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, CustomizeProduct. No Search, AddToWishlist, AddPaymentInfo | no access |
| Meta Conversions API Purchase | yes: backend sends it straight to Meta with `event_id = kw_<orderId>`; pixel id and token are set on the server; no test-event code set | not exercised (needs a real order) | no access: acceptance and de-duplication **not verified** |
| Purchase fires once | yes: browser guard per order id (sessionStorage) + same event id as the server | not exercised | no access |
| Server-side GTM (Cloud Run `sgtm`, container `GTM-T8D4V2D7`) | n/a | **down**: `/healthy` 500, everything else 503, also on the Cloud Run address directly | owner's screenshot shows min instances 1, image pinned by digest |
| Search Console | DNS TXT verification record exists | — | no access |
| Merchant Center | feed corrected and valid XML | feed fetched and checked | no access: approval status unknown |

**Server-side GTM outage: what to do (owner, Google Cloud console)**
1. Cloud Run → service `sgtm` → **Logs**. The startup lines say exactly why it will not serve (the usual causes: the image is too old, or the server container `GTM-T8D4V2D7` / its config string is no longer valid).
2. The image is pinned to one old build (`gtm-cloud-image@sha256:688d35c…`). Edit & deploy a new revision with image `gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable` (keep the same `CONTAINER_CONFIG`, port 8080, 1 GiB). This is the most likely fix.
3. If it still fails: in Tag Manager open the server container `GTM-T8D4V2D7` → Admin → Container settings → copy the current "Container config" string, set it as `CONTAINER_CONFIG`, deploy again. Make sure the container has a published version.
4. Check: `https://sgtm.khushbuwaala.com/healthy` must answer `ok`.
Note: the `CONTAINER_CONFIG` value is a secret for that container. It was pasted in chat; it is not stored in the repositories or these documents.

## Deploy 2026-11-23 (09:27–09:30 UTC)

- **Backend** `15d3e8b` (previous `06e1d83`; rollback copy `~/deploy-backups/backend-dist-20261123-092732`). Pull, `prisma generate`, build, `pm2 restart`. No dependency change.
- **Database:** one unique index created on `wishlist_items` (`userId` + `productId`, name `wishlist_items_userId_productId_key`). The collection was empty (0 documents, 0 duplicates). No other write.
- **Storefront** `49bd812` (previous `722a495`; rollback copy `~/deploy-backups/storefront-next-20261123-092852`). Build OK on the server, restart ~2 s.
- **Verified live:**
  - 23 key pages return 200; **135/135 product pages 200**.
  - `/shop` HTML has 24 product links; the sitemap lists 155 URLs incl. 135 products.
  - Product title, description and Product structured data are correct; a filtered page is noindex.
  - Discovery on the real database gives the same answers as the local tests (Woody + Oud + long-lasting under ৳500 = 24; "savage" → Dior Sauvage; "গোলাপ" → 67; "golap" suggests Rose / Floral).
  - Wishlist returns 401 without login.
  - Supplier is `null` in public product responses.
  - Phone browser check of a filtered shop page and a product page: 0 px overflow, no broken images, breadcrumb shows the real collection.
  - No new backend errors after the restart.
- **Wishlist writes verified live** (owner approved a temporary `[TEST-CLAUDE]` customer): 13/13 checks pass against the real database: add, repeat add harmless, bad id 400, unknown and hidden product 404, merge adds only real new products, items carry name and price, the unique index refuses a duplicate, remove, clear, 401 without login. The test customer and its rows were removed (0 test users, 0 wishlist rows left). Script: `D:Projectskhushbuwaala_devwl-live-test.js`. Not checked: the same flow through the site's own login screen in a browser.

## Found during the deploy check: server-side tracking is DOWN (not caused by the deploy)

`sgtm.khushbuwaala.com` (nginx → Google Cloud Run `sgtm-865653302372.us-central1.run.app`) answers **503 "The service you requested is not available yet"** for every request, including when the Cloud Run address is called directly. The web GTM container sends GA4 (`G-TLLSPJHM9W`) through that address, so **GA4 hits are currently failing in the browser**, and anything the server container forwards (Meta Conversions API) is not being sent either. The Meta browser Pixel script loads directly from Facebook and is not affected by this. Since when is unknown. Fix needs the owner's Google Cloud account (check the Cloud Run service: billing, crashed revision, or deleted container config). See TASKS.

| Repo | Branch | State |
|---|---|---|
| backend | `main` | `15d3e8b` pushed and live |
| storefront | `main` | `49bd812` pushed and live |
| admin | `main` | untouched |

## Deploy order used (kept for the next deploy)

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
- **Header search** (magnifier icon): suggestions while typing (scent families, notes, collections, products with price), starting points for people who do not know a name, the customer's own recent searches. The old drawer showed two hard-coded "recent searches" to everyone.
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

1. Owner: restore the server-side tagging service on Google Cloud (tracking is down), answer the questions in TASKS ("Owner questions"), and give access to GTM / GA4 / Meta Events Manager / Search Console.
2. Then continue with TASKS P1: product page "similar scents" + profile block + heart → cart tracking calls → home page product sections server-rendered → cart hydration fix.
