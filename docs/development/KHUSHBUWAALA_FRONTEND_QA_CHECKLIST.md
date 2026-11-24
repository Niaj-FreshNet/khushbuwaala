# Khushbuwaala storefront — visual QA checklist

Required by the owner's Sections 15, 16 and 17 (2026-11-24, at the end of the master spec). A page is ticked only after its real rendered mobile and desktop layout has been looked at and its main interactions tried. "Code is finished" is not a tick.

**How to read a cell**

- `OK` looked at and nothing wrong found
- `FIXED` a problem was found, fixed, and looked at again
- `ISSUE` a problem is known and not fixed yet (described under the table)
- `—` not inspected yet

**Honest limits of these checks.** Phone widths are browser emulation on one Windows computer, not real phones. The 1600+ column was looked at in real Chrome on the live site (window about 1570px wide). 768px and 1440px were only drawn scaled down, so small details at those sizes are not confirmed. No real Android phone, Samsung Internet or iPhone has been used yet. Real-device checks are a separate column and are all still open.

Last updated: 2026-11-24 (pass 5: sample pages removed, quick view price, hero banner).

## Routes

| Route | 320 | 390 | 430 | 768 | 1440 | 1600+ | Interactions | Real phone |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` Home | FIXED | FIXED | — | — | FIXED (scaled) | FIXED | Hero slider arrows and dots work; banner reshaped so the artwork shows | — |
| `/shop` | FIXED | OK | OK | — | — | OK | Filter, clear, search suggestions and sorting (cheapest first) tried and work | — |
| `/product/[slug]` | — | FIXED | — | — | OK (scaled) | OK | Add to cart, gallery pictures, size change and quantity tried: price and sticky bar follow. Quick view: see shared components | — |
| `/cart` | — | FIXED | — | — | — | OK (empty cart) | Quantity up, down and remove tried: counts and totals follow. Coupon not tried | — |
| `/checkout` | FIXED | FIXED | — | — | — | OK (empty cart) | Empty-form validation, district rule and district list tried. Placing an order, coupon and online payment not tried | — |
| `/thank-you` | — | OK (made-up local order) | — | — | — | — | Invoice and track buttons not tried | — |
| `/wishlist` | — | OK (empty) | — | — | — | — | With saved items not seen | — |
| Category pages (`/inspired-perfume-oil`, `/oriental-attar`, `/organic-attar`, `/artificial-oud`, `/brand-perfumes`, `/niche-perfumes`, `/womens-perfume`, `/gifts-and-packages`, `/new-arrivals`, `/accessories`) | — | OK (`/inspired-perfume-oil` only; same layout as the shop) | — | — | — | — | — | — |
| `/notes`, `/scents` | — | — | — | — | — | — | The bare addresses answer 404 (only the inner pages exist). Inner pages not inspected | — |
| `/track-order`, `/orders` | — | OK (`/track-order`, empty form) | — | — | — | — | Looking up an order not tried | — |
| `/login`, `/sign-up`, `/forgot-password`, `/reset-password`, `/verify-email` | — | FIXED (`/login`, `/sign-up`) | — | — | — | — | Signing in not tried | — |
| `/my-account` | — | — | — | — | — | — | — | — |
| `/contact`, `/stores` | — | FIXED | — | — | — | — | Links not tapped. `/click-collect` was removed (owner: pickup is not offered); the address now leads to `/stores` | — |
| `/about`, `/manifesto`, `/career` | — | OK (`/about`); FIXED (`/career`, not looked at after the rewrite) | — | — | — | — | — | — |
| `/blog` | — | OK (empty: articles come from the admin panel) | — | — | — | — | `/news` was removed (sample content); the address now leads to `/blog` | — |
| Policy pages (`/shipping-policy`, `/refund-policy`, `/exchange-policy`, `/privacy-policy`, `/terms-conditions`) | — | FIXED (`/shipping-policy`); OK (`/refund-policy`, `/terms-conditions` top of page) | — | — | — | — | — | — |
| Not-found and error pages | — | FIXED (not-found) | — | — | — | — | Error page not seen | — |

## Shared components

| Component | State | Notes |
| --- | --- | --- |
| Bottom bar (phones) | FIXED | Fifth item was off-screen at 320px; a strip stayed visible when the bar hid on scroll; now one solid bar, all five items fit |
| Product card | FIXED | Empty bands above the name and above the buttons removed; buttons fit two-across at 320px; two scent labels on phones instead of three cut-off ones |
| Section heading | FIXED | Bouncing dots, pulsing sparkle and pink band removed; one heading style |
| Product page buttons | FIXED | Add to Cart is brand green, Buy Now is the same red as on the cards (were blue-purple and orange-pink) |
| Product page sticky buy bar | FIXED | Was see-through over the description text; now solid |
| Header and announcement bar | — | At 320px the announcement text looked empty in one capture; to re-check |
| Navigation drawer | FIXED | Seen at 390px. Track Order button was blue-purple and the header pink; now green and plain. Category sub-menu not opened |
| Cart drawer | FIXED | Seen at 390px with one item. A second subtotal sat under the close button; removed. Quantity, remove and swipe-to-close not tried in the drawer |
| Cart item buttons | FIXED | Remove, minus and plus had no names for screen readers and were 32–34px; now named and 40px |
| Search drawer | OK | Seen at 390px: typing "oud" gives browse-by chips, six products with prices, "See all 50 results" |
| Filters and sorting (shop) | OK | Filter sheet at 390px: plain-language groups with counts, live "Show N perfumes", chosen filter shown as a chip with Clear all. Sorting not tried |
| Product gallery | — | |
| Quick view | FIXED | Desktop, real Chrome, live site. It showed and charged the full price (৳880) for a product on sale at ৳550; buttons were the reverse colours of the rest of the shop. Both fixed and seen |
| Toasts | OK | Seen on checkout validation: light, readable |
| Forms and validation (checkout) | FIXED | Field messages and red borders appear; district is now asked for when it sets the delivery charge. Login and contact forms not inspected |
| Loading skeletons | — | |
| Footer | — | |

## Theme and cross-device (owner Section 16)

| Check | State | Notes |
| --- | --- | --- |
| Site declares itself light-only (`color-scheme: only light`, meta tag) | FIXED | Before: nothing declared, so a phone in dark mode could darken the page, form fields and scrollbars by itself |
| Browser bar colour | FIXED | Was black on dark-mode phones, white on others; now always white |
| Toast theme | FIXED | Fixed to light |
| Autofill field colour | FIXED (not seen yet) | White field, dark text |
| Taka sign and Bengali text come from the shop's own font | FIXED | Before: the Taka sign came from whichever system font the phone had |
| Every-grid `transition: all 0.5s` | FIXED | Removed; it animated layout changes on every grid |
| Scrollbar colour | FIXED | Was a red-pink gradient; now neutral grey |
| Samsung Internet forced dark mode | ISSUE | That browser can still darken sites on its own; it does not fully honour the light-only signal. Needs a real Samsung phone to see what it does now |
| Dark-mode classes left in shared UI parts (`dark:`) | OK | Nothing ever switches them on |
| Text below 11px | FIXED | Home page at 390px: 144 before pass 1, 2 after it (two badges). Those and the 11px labels on product cards are now 11–12px |
| Safe-area and 100vh use | — | 30 files use `100vh` / `h-screen`; to review on phones with moving toolbars |
| Real Android / iPhone comparison | — | Not done |

## Known issues not fixed yet

2. Announcement bar at 320px: text looked missing in one capture; may be the fade animation mid-way.
3. Samsung Internet's own dark mode (see table).
4. Checkout stuck on its loading placeholder once, in real Chrome on the live site, a few minutes after a restart (the footer image failed to load in the same view). Five further loads cleared the placeholder in under half a second. Not reproduced; to watch.
7. Each deploy gives a few seconds of 502 while the shop restarts.
8. Shop page: an empty band shows between the header and the sticky filter bar while scrolling.
9. The banner artwork is 2:3 for phones and 3:2 for desktop. The banner box now suits those shapes, but a wide banner (about 2.2:1, e.g. 1760×800) made for desktop would fill it without any cropping.
10. The third banner says "Get up to 30% off on all products". Whether that offer is running is the owner's to confirm.
11. Product card shows "-38%" where the product page shows "37.5% OFF" for the same sale.
13. Announcement bar text is missing in most captures from the test browser but shows in real Chrome. Likely the fade animation not running in a background tab; not seen by real visitors so far.
14. Prices are written "৳360" on the product page and "৳ 360" on cards and in the cart.
5. The Taka sign in regular (not bold) text is drawn smaller than the digits next to it. Bold prices look right.
6. Thank-you page and every other route in the table marked `—`.
