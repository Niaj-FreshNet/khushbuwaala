# Khushbuwaala Storefront — Decisions

Numbered `SF-xxx` to stay apart from the admin/backend decisions (`D-xxx` in `D:\Projects\khushbuwaala\KHUSHBUWAALA_DECISIONS.md`).

## SF-001 — Discovery runs in the backend, from an in-memory list (2026-11-23)
**Decision:** Search, filters and counts are answered by the backend from a list of all published products kept in memory (rebuilt at most every 60 s and right after any product change), not by MongoDB queries and not in the browser.
**Why:** The filters need whole-word, case-insensitive matching over hand-typed lists, typo tolerance and a live count per option. MongoDB cannot do that in one query. The catalogue is 135 products; measured cost is under 3 ms per search and under 1 ms per filter, and a few thousand products would still be fine. One endpoint also gives the future perfume assistant the same structured data.
**Trade-off:** Prices/stock in listings can be up to 60 s old. Checkout always reads the database, so a customer can never pay a stale price.
**Revisit when:** the catalogue passes roughly 5,000 products, or the API runs as more than one process (each would hold its own copy; still correct, just duplicated).

## SF-002 — No data migration: structure is derived, originals stay (2026-11-23)
**Decision:** Families, notes, occasions etc. are computed from what the admin already typed (accords, fragrance families, notes, best-for) through an alias table (`taxonomy.ts`). No product document was changed.
**Why:** Zero risk to live data, instantly reversible, and it improves by itself as staff fix spellings. A value that matches no alias is simply not used for filtering (it still shows on the product page).
**Consequence:** Teaching the shop a new spelling is a one-line code change today. An admin screen for aliases is a later task.

## SF-003 — Within a group: families and notes narrow (AND), everything else widens (OR) (2026-11-23)
**Why:** "Woody and sweet" means a perfume that is both. "Long-lasting or very long-lasting" means either. Counts next to each option always show exactly how many products picking it would give, so a customer cannot filter into an empty page by surprise.

## SF-004 — Longevity and projection in plain words, never hours or feet (2026-11-23)
**Decision:** "Long-lasting — stays most of the day", "Strong — fills the room". The old "8–10 Hours" / "7–9 Feet" labels were removed.
**Why:** The shop has no measurements behind those numbers, and how long a scent lasts depends on skin, weather and amount. The brief forbids unsupported claims.

## SF-005 — "For him" / "For her" both include unisex (2026-11-23)
**Why:** 100 of 135 products are unisex; hiding them from someone shopping "for him" would hide most of the shop.

## SF-006 — No brand filter (2026-11-23)
**Why:** For inspired oils the `brand` field holds the house that inspired it (Tom Ford, Creed…). A "Brand: Tom Ford" filter would suggest we sell Tom Ford. Brand words still work in search.

## SF-007 — The address bar is the filter state; filtered pages are not indexed (2026-11-23)
**Decision:** Every filter/search/sort lives in the URL and the page is rendered on the server. Plain shop/collection pages (and their page 2, 3…) are indexable with self canonicals. Any filtered or searched view, and any collection with no products, is `noindex, follow`.
**Why:** Shareable links, working back button, products in the HTML for search engines; no thousands of near-duplicate pages in Google.

## SF-008 — One listing component for the shop and all collections (2026-11-23)
**Decision:** The 11 page files are identical three-line wrappers; wording and product selection live in `src/config/collections.ts`.
**Why:** The old pages were 100+ line copies that had drifted apart (hard-coded category ids, some pointing at categories that do not exist).

## SF-009 — Wishlist: device first, account when signed in (2026-11-23)
**Decision:** Guests save on the device. After login the device list is merged into the account and the account list becomes the truth. The saved copy holds only id/name/slug/image; prices and stock are fetched fresh when the wishlist opens.
**Why:** No login wall for a low-commitment action (most visitors arrive from ads on phones), and no stale prices.
**Note:** the unique index (user + product) must be created on the live database at deploy; the code prevents duplicates without it except in a double-tap race, and de-duplicates on read.

## SF-010 — Remove figures nothing supports (2026-11-23)
Removed: default 5.0 rating on products without reviews; "99% Satisfaction Rate"; "4.8/5 Customer rating"; mock review component (unused file). **Not** changed, pending the owner: "Since 2020 / 6+ years", "10K+ Happy Customers", "50+ brands", social follower counts.

## SF-011 — Supplier names are internal (2026-11-23)
The public product API returned each product's supplier. It is now `null` for the public and non-staff; the admin still receives it.

## SF-012 — Pinch-zoom back on; inputs 16px on phones (2026-11-23)
**Why:** Blocking zoom is an accessibility failure. It had been blocked to hide that 13px inputs make iPhones zoom in on focus; 16px inputs remove the cause.

## SF-013 — Local testing without the live database (2026-11-23)
**Decision:** New backend code was exercised through a local stand-in API that runs the real routers/services on a snapshot of the public catalogue with a fake of the Prisma calls, forwards other GETs to the live public API and refuses every non-GET.
**Why:** The only database is live and reachable only from the server (D-003, D-013). This gives real browser testing of the storefront with no possible write to production.
**Limit:** it does not prove the Prisma queries against real data; that check happens right after deploy.

## SF-014 — AI assistant: foundation only (2026-11-23)
No AI code, keys or chat UI were added. What exists for it later: structured families/notes/occasions/strength per product (`profile`), one query endpoint that accepts those as parameters, a similarity function, and a synonym table for how customers actually describe scents.

## SF-015 — Owner decisions of 2026-11-23 (final)
1. Brand since 2020; fragrance experience 8+ years. Never "8 years in business".
2. No customer, brand, team or follower counts unless independently verified. Trust comes from content and service, not badges.
3. `/accessories` and `/niche-perfumes` stay as routes for later, out of navigation, friendly when empty, never indexed while empty.
4. Storefront "Organic Attar" = admin category NATURAL ATTAR OIL. Customer-facing name is "Natural Attar"; no organic certification claims.
5. Placeholder blog post unpublished, not deleted.
6. Tracking is reported in four separate columns: in code / in the browser / in the vendor dashboard / cannot verify.
7. No placeholder verification codes; Search Console by DNS Domain property.
The owner also gave standing approval to implement, deploy and make reasonable non-destructive decisions without asking.

## SF-016 — Inspired oils carry our own brand in the Google feed (2026-11-23)
The product's `brand` field holds the house that inspired an oil. In the Shopping feed that would present our oil as that house's product, so products in an "inspired" category are sent with brand Khushbuwaala. Brand perfumes keep their real brand. The storefront was not changed.

## SF-017 — Cart count fix without touching cart storage (2026-11-23)
The cart still loads from the browser when the app starts (checkout relies on it being there on first render; moving it risked an effect saving an empty cart over a full one). Only the header badge waits for the page to become interactive, which removes the full-page rebuild for visitors with items in the cart.

## SF-018 — Deploys are run in separate steps (2026-11-23)
Save a copy → pull → build → restart, each as its own command, with no automatic delete/reset on failure. If a build fails the previous build is restored by hand from `~/deploy-backups`.

## SF-019 — A guest's cart belongs to the device; the server never dictates its quantity (2026-11-23)
**Decision:** For visitors without an account the cart on the device is the truth. The server keeps a row per visitor line only so staff can see open carts and so the order can link to it; the row is found by its id, which only that visitor's device holds. For signed-in customers the account's cart is the truth, as before.
**Why:** Guests have no identity the server can look them up by. Looking them up by "no user" made all guests one customer.

## SF-020 — Test orders on live (2026-11-23)
One marked order (`[TEST-CLAUDE]`, shop's own phone, no email, cash on delivery, cheapest in-stock size), placed only with the owner's explicit yes, cancelled through the normal admin route right after, stock checked before and after. It does count as one real Purchase at Meta; that is the point of the test and is recorded in PROGRESS.

## SF-021 — Storefront content the owner edits lives in one settings document (2026-11-23)
**Decision:** Announcement bar, hero banners and home rows are one JSON document (`storefront_settings`, key "storefront") behind `/api/storefront/settings`. The storefront carries the same content as a built-in fallback.
**Why:** These are the things that change with campaigns and seasons. One small document with strict checking is enough; a general page builder would be more to learn and more to break.
**Rules:** links must stay inside the shop; pictures only from the site or our image host; a row's products are described with the shop's own filters; a save with any bad entry saves nothing.

## SF-022 — Indexable landing pages instead of indexable filters (2026-11-23)
**Decision:** `/scents/<family>` and `/notes/<note>` are real pages with their own wording and are indexed; every `?filter=` view stays noindex.
**Why:** People search "oud attar", "woody perfume". A written page per intent can rank; thousands of filter combinations would be near-duplicates.

## SF-023 — No newsletter form until there is somewhere for the addresses to go (2026-11-23)
The forms were removed because they did not save anything. Collecting emails needs a storage and sending tool chosen by the owner first.

## SF-024 — Motion on the home page is CSS only (2026-11-23)
Content must be visible in the HTML without waiting for a script. Entrance animations driven by a script library hid the category grid and headings until it loaded.

## SF-025 — Shop events wait for Tag Manager (2026-11-23)
Tag Manager loads late so pages open faster (SF-024 era speed work). Events pushed before it loads reached the Meta tag before the pixel was set up and were lost. Rather than load Tag Manager early again, events go through `kwDataLayerPush`, which holds them until Tag Manager is running. New tracking code must use it, not `window.dataLayer.push`.

## SF-026 — Meta tags in Tag Manager use explicit standard events (2026-11-23)
The Meta Pixel template's "Enhanced Ecommerce dataLayer Integration" and "Use GA4 dataLayer Integration" boxes stay off: they expect the old Universal Analytics data shape and fail silently with ours (this broke three events for about half an hour on 2026-11-23). Each tag names its standard event and lists value, currency, content_ids, contents and content_type itself.

## SF-027 — The shop is light-only and says so (2026-11-24)
There is no dark theme. The page declares `color-scheme: only light` (CSS and meta tag) and a white browser bar, so browsers do not darken it or its form fields by themselves. Do not add `prefers-color-scheme` branches or a theme switch without the owner asking.

## SF-028 — Two action colours (2026-11-24)
Buy Now is the red gradient (`from-orange-600 via-red-600 to-rose-600`) everywhere; Add to Cart and selected states are brand green (`emerald-700`). No blue, purple or pink gradients on shopping actions. Section headings use one plain style (`SectionTitle`), no moving decorations.

## SF-029 — Fonts without generated stand-ins (2026-11-24)
The font order is written out in `globals.css`: Inter, Noto Serif Bengali, then the generated stand-in. The stand-in is the phone's own Arial/Roboto and used to sit in front of the Bengali font, so the Taka sign differed between phones. (`adjustFontFallback: false` was tried first; the production build ignores it.)
