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
