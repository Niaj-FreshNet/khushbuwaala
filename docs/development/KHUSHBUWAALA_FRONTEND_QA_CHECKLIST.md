# Khushbuwaala storefront — visual QA checklist

Required by the owner's Sections 15, 16 and 17 (2026-11-24, at the end of the master spec). A page is ticked only after its real rendered mobile and desktop layout has been looked at and its main interactions tried. "Code is finished" is not a tick.

**How to read a cell**

- `OK` looked at and nothing wrong found
- `FIXED` a problem was found, fixed, and looked at again
- `ISSUE` a problem is known and not fixed yet (described under the table)
- `—` not inspected yet

**Honest limits of these checks.** Everything here is browser emulation on one Windows computer, not real phones. The test browser could only draw 320–430px widths at full size; 768px and wider were drawn scaled down, so small details at those sizes are not confirmed. No real Android phone, Samsung Internet or iPhone has been used yet. Real-device checks are a separate column and are all still open.

Last updated: 2026-11-24 (pass 2: cart and checkout).

## Routes

| Route | 320 | 390 | 430 | 768 | 1440 | 1600+ | Interactions | Real phone |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` Home | FIXED | FIXED | — | — | OK (scaled) | — | — | — |
| `/shop` | FIXED | — | — | — | — | — | — | — |
| `/product/[slug]` | — | FIXED | — | — | OK (scaled) | — | — | — |
| `/cart` | — | FIXED | — | — | — | — | Quantity and remove not tried yet | — |
| `/checkout` | FIXED | FIXED | — | — | — | — | Form validation and placing an order not tried yet | — |
| `/thank-you` | — | — | — | — | — | — | — | — |
| `/wishlist` | — | — | — | — | — | — | — | — |
| Category pages (`/inspired-perfume-oil`, `/oriental-attar`, `/organic-attar`, `/artificial-oud`, `/brand-perfumes`, `/niche-perfumes`, `/womens-perfume`, `/gifts-and-packages`, `/new-arrivals`, `/accessories`) | — | — | — | — | — | — | — | — |
| `/notes`, `/scents` | — | — | — | — | — | — | — | — |
| `/track-order`, `/orders` | — | — | — | — | — | — | — | — |
| `/login`, `/sign-up`, `/forgot-password`, `/reset-password`, `/verify-email` | — | — | — | — | — | — | — | — |
| `/my-account` | — | — | — | — | — | — | — | — |
| `/contact`, `/stores`, `/click-collect` | — | — | — | — | — | — | — | — |
| `/about`, `/manifesto`, `/career` | — | — | — | — | — | — | — | — |
| `/blog`, `/news` | — | — | — | — | — | — | — | — |
| Policy pages (`/shipping-policy`, `/refund-policy`, `/exchange-policy`, `/privacy-policy`, `/terms-conditions`) | — | — | — | — | — | — | — | — |
| Not-found and error pages | — | — | — | — | — | — | — | — |

## Shared components

| Component | State | Notes |
| --- | --- | --- |
| Bottom bar (phones) | FIXED | Fifth item was off-screen at 320px; a strip stayed visible when the bar hid on scroll; now one solid bar, all five items fit |
| Product card | FIXED | Empty bands above the name and above the buttons removed; buttons fit two-across at 320px; two scent labels on phones instead of three cut-off ones |
| Section heading | FIXED | Bouncing dots, pulsing sparkle and pink band removed; one heading style |
| Product page buttons | FIXED | Add to Cart is brand green, Buy Now is the same red as on the cards (were blue-purple and orange-pink) |
| Product page sticky buy bar | FIXED | Was see-through over the description text; now solid |
| Header and announcement bar | — | At 320px the announcement text looked empty in one capture; to re-check |
| Navigation drawer | — | |
| Cart drawer | FIXED | Seen at 390px with one item. A second subtotal sat under the close button; removed. Quantity, remove and swipe-to-close not tried yet |
| Search drawer | — | |
| Filters and sorting (shop) | — | |
| Product gallery | — | |
| Quick view | — | |
| Toasts | FIXED (not seen yet) | Forced to the light look; not yet triggered and looked at |
| Forms and validation (checkout, login, contact) | — | |
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
| Text below 11px | ISSUE | 144 pieces of text under 11px on the home page at 390px (before this pass); to recount and raise |
| Safe-area and 100vh use | — | 30 files use `100vh` / `h-screen`; to review on phones with moving toolbars |
| Real Android / iPhone comparison | — | Not done |

## Known issues not fixed yet

1. Home page at 390px had 144 small-text items under 11px (labels, badges). Recount after pass 1 and raise the worst.
2. Announcement bar at 320px: text looked missing in one capture; may be the fade animation mid-way.
3. Samsung Internet's own dark mode (see table).
4. Checkout: when scrolled to the bottom, two Place Order buttons are on screen (the one in the page and the sticky one). The sticky one should step aside there.
5. The Taka sign in regular (not bold) text is drawn smaller than the digits next to it. Bold prices look right.
6. Thank-you page and every other route in the table marked `—`.
