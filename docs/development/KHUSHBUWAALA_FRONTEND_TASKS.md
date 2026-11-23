# Khushbuwaala Storefront — Task Checklist

Legend: `[x]` done and verified locally · `[~]` built, not fully verified · `[ ]` not started · `[!]` blocked · `[?]` needs the owner
**Last updated:** 2026-11-23 (session 1). "Verified" means locally (build + browser + tests); nothing is deployed yet.

## Deploy
- [x] **P0** Backend `15d3e8b`, wishlist unique index, storefront `49bd812` deployed 2026-11-23; smoke 23 pages + 135/135 products; discovery verified on the real database
- [x] **P0** Wishlist writes for a signed-in customer verified on live, 13/13 (temporary test customer, removed afterwards)

## P0 — Tracking outage (found 2026-11-23, not caused by the deploy)
- [!] **P0** `sgtm.khushbuwaala.com` returns 503 from its Google Cloud Run service (`sgtm-865653302372.us-central1.run.app`). GA4 hits fail; server-forwarded events (Meta CAPI) are not sent. Needs the owner's Google Cloud access: open Cloud Run → service `sgtm` → check billing, the latest revision's logs, and the CONTAINER_CONFIG variable. Blocked: no access.
- [ ] After it is back: confirm a GA4 hit returns 200 and a test Purchase shows in Meta Events Manager with browser + server de-duplicated

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
- [x] Verified against the real database after deploy (API level). Still to do: sign in through the site in a browser and watch a guest list merge

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
- [!] GTM: add triggers/tags for the new events (GA4 + Meta Search / AddToWishlist). The public web container currently has GA4 tags for page_view, view_item, select_item, add_to_cart, begin_checkout, purchase only: **no** view_item_list, search, add_to_wishlist, add_shipping_info, add_payment_info, view_cart, remove_from_cart. Blocked: no GTM access
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

---

## Update 2026-11-23, session 2

**Done and live**
- [x] All 7 owner decisions applied (wording, counts removed, empty collections out of menus, Natural Attar naming, blog post unpublished, tracking audit, Search Console check) — see PROGRESS
- [x] Product page: scent summary, similar scents (server-rendered), wishlist heart
- [x] view_cart / remove_from_cart; category names in every event
- [x] Header cart count hydration fix (the cart data itself still loads at start-up; other cart-dependent text, e.g. "1 item in your cart" on /cart, still re-renders on that page only)
- [x] Meta server Purchase: phone format, name split, refusals logged, tests
- [x] Google Shopping feed corrected (age group, links, hidden sizes, brand, identifier_exists)
- [x] Live wishlist write check 13/13

**Blocked on the owner (exact requirement)**
- [!] **P0 sGTM down** — fix in Google Cloud Run (steps in PROGRESS). Until then GA4 receives nothing from the site.
- [!] GTM access (GTM-KDFMX5QL web + GTM-T8D4V2D7 server): add GA4 tags for view_item_list, view_cart, remove_from_cart, add_shipping_info, add_payment_info, search, add_to_wishlist and Meta tags for Search, AddToWishlist, AddPaymentInfo. The site already sends all of them to the dataLayer.
- [!] Meta Events Manager access: confirm the server Purchase is accepted and de-duplicated with the browser Purchase (needs one real or test order).
- [!] Search Console access: confirm the Domain property is verified (DNS record exists) and submit `https://khushbuwaala.com/sitemap.xml`.
- [!] Merchant Center access: confirm the feed is fetched and items approved; shipping must be set there (the feed has no shipping block).

**Next (no blocker)**
- [ ] Checkout + thank-you audit on a phone, including a controlled test order to exercise begin_checkout → purchase (needs the owner's OK for one `[TEST-CLAUDE]` cash-on-delivery order that is cancelled afterwards)
- [ ] Home page: server-render the first product row; brand story strip using the agreed wording
- [ ] Cart page text hydration (count/total lines) without changing how the cart is stored
- [ ] Performance baseline (Lighthouse on phone), image sizes, unused packages
- [ ] Admin: homepage content, collections and scent synonyms editable without code
- [ ] Feed: 500 ml / 1000 ml wholesale sizes are in the Shopping feed; decide whether to keep them
- [ ] Two product images return 404 from Cloudinary (seen in the storefront error log): re-upload in the admin
- [ ] `organizationStructuredData` in `app/layout.tsx`: opening hours and social links are unverified

---

## Update 2026-11-23, session 3

**Done and live**
- [x] **P0** Guest carts shared between all visitors (wrong quantities) — fixed in backend + storefront, verified live
- [x] **P0** Cart rows could be read/changed/deleted by anyone — ownership rules added
- [x] Test order #766624: checkout + purchase events verified in the browser; purchase fires once; Meta accepted the server event; order cancelled, stock restored
- [x] Checkout tracking: shipping/payment events once and at the right moment; online payment type reported correctly

**New follow-ups**
- [ ] 144 old shared guest cart rows (`cart_items`, status IN_CART, no user): harmless now; remove with a backed-up script if the owner wants a clean admin Carts page
- [ ] Price typos in the catalogue (found while choosing the test product), to fix in the admin: **Black Afgano** 500 ml = ৳900 and 100 ml = ৳18,000 look swapped/mistyped; several products list 50 ml cheaper than 25 ml (e.g. Axe Signature 25 ml ৳1,080 vs 50 ml ৳800)
- [ ] Thank-you page after a refresh shows no order details to a guest; consider a short-lived view token
- [ ] purchase event items: add item_category (order lines do not carry the category today)
- [!] Meta Events Manager: confirm #766624's browser + server Purchase appear as one event (needs access)

---

## Update 2026-11-23, session 4

**Done and live**
- [x] Home page server-rendered with discovery section and brand story; dead newsletter forms removed
- [x] Speed: lazy second photo, no script-gated content on home, slimmer listings, prebuilt product pages (5-minute refresh)
- [x] **Admin: Home page content** (announcement bar, banners, product rows) — backend + admin screen + storefront, verified on live
- [x] Scent-family (18) and note (12) landing pages, in the sitemap, linked from product pages and home
- [x] Clean-up: 36 unreachable files, fake `/api/orders`, dead `proxy.ts`, single Organization block, lint script

**Still open (no blocker)**
- [ ] Admin: edit the scent taxonomy (aliases, synonyms) and the collections/landing-page wording without code
- [ ] Admin: contact details (phone, WhatsApp) in one editable place; today `config/site.ts` plus 13 hard-coded phone links
- [ ] Storefront lint: 284 existing problems; 36 type errors (build ignores them)
- [ ] Lighthouse / Core Web Vitals baseline on a phone; home page still ships about 1 MB of script (uncompressed)
- [ ] Product page: thumbnails render blank until loaded; purchase event items have no category; thank-you page after refresh
- [ ] Newsletter: there is no subscriber storage or sending tool. If the owner wants one, it needs a decision on the tool first
- [ ] 144 old shared guest cart rows; price typos (Black Afgano, 50 ml cheaper than 25 ml on several products)
- [ ] `~/deploy-backups` on the server is about 2.5 GB of build copies (disk is at 18%); prune old ones occasionally

**Blocked on the owner** (unchanged): sGTM on Google Cloud is down; access to GTM, GA4, Meta Events Manager, Search Console, Merchant Center.

## Update 2026-11-23, session 5 (tracking accounts)

**Done**
- [x] Found why the tagging server is down: Google Cloud billing disabled, $10.31 overdue, card declined
- [x] Tag Manager v17: Meta Purchase event ID matches the backend; product data on ViewContent / AddToCart / InitiateCheckout; base pixel sends PageView; GA4 tag for the 7 new shop events; Meta Search tag
- [x] Storefront `1520cd7`: events wait for Tag Manager before being sent

**Owner**
- [ ] Pay the Google Cloud balance ($10.31) so the tagging server and GA4 work again

**Next, in this order**
- [ ] After the bill is paid: confirm `/healthy` is `ok`, then GA4 Realtime shows page_view, view_item, add_to_cart, and the new events
- [ ] Next real order: in Meta Events Manager confirm the browser and server Purchase show as one (de-duplicated)
- [ ] Test InitiateCheckout and Search in Meta Test Events
- [ ] Meta tags for AddToWishlist and AddPaymentInfo
- [x] Search Console checked: Domain property verified, sitemap read today (Success). Optional: remove the dead 2021 `sitemap_index.xml` entry
- [ ] Merchant Center: it holds 30 old products (28 not approved) and targets UK / India / US. Add the shop feed (`https://api.khushbuwaala.com/api/products/google-shopping-feed.xml` or the address the backend is served on, 993 items) as the data source, set the country to Bangladesh and the shipping rates. Needs the owner's yes because it changes what Google shows
- [ ] Open "Fragrance data check" on the live admin and read the real numbers
- [ ] Product pages prefetch about 40 pages on load: decide whether to cut it

## Update 2026-11-23, session 6

- [x] Merchant Center: shop feed added as a product source for Bangladesh (941 products taken in)
- [x] Owner paid the Google Cloud balance
- [ ] Tagging server still reports "billing is disabled" after the payment. Recheck `/healthy`; if still down, re-select the billing account on the project (steps in PROGRESS, session 6)
- [ ] Merchant Center in 2–3 days: read approved / not approved counts and the top issues; find why 52 feed items were not taken in
- [x] Merchant Center delivery charge set to ৳120 flat, free over ৳1,000, 1–2 days (owner gave ৳60 Dhaka / ৳120 outside; Google allows one rate per country here, so the higher one is shown)
- [ ] Feed descriptions contain leftover `&nbsp;` codes; clean them in the feed builder
- [ ] Owner: free space on drive C: of the work computer (it is full)
