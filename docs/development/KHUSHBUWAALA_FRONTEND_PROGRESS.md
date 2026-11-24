# Khushbuwaala Storefront — Progress

**Last updated:** 2026-11-24 (session 7)
**Spec:** `Khusbuwaala_Storefront_Master_Development_Prompt.md` (same folder)
**Related:** [TASKS](KHUSHBUWAALA_FRONTEND_TASKS.md) · [DECISIONS](KHUSHBUWAALA_FRONTEND_DECISIONS.md) · admin/backend history: `D:\Projects\khushbuwaala\KHUSHBUWAALA_*.md`

## Overall status

Phase 0 (audit) done. Phase 1 (product discovery, header search, wishlist, SEO foundations) is **live since 2026-11-23 ~15:30 Dhaka** (owner approved the deploy).

## Session 7 — 2026-11-24 (owner Sections 15–17: visual QA, same look on every phone, selling first)

The owner added three mandatory sections (visual QA on every page, cross-device consistency, business objective). They are appended to the master spec under "ADDITIONAL MANDATORY REQUIREMENTS". A route-by-route checklist now lives in `KHUSHBUWAALA_FRONTEND_QA_CHECKLIST.md`; nothing is ticked there without being looked at.

### Why the shop looked different on different phones (found in code and on the live site)
- The site never told the browser it is a light-only site. A phone in dark mode could therefore darken the page, form fields, scrollbars and autofill on its own, and each browser does that differently.
- The browser bar colour was set to black for dark-mode phones and white for the rest.
- The Taka sign was drawn by whichever system font the phone had (the stand-in font generated for Inter sat in front of the Bengali font), so its shape and size changed from phone to phone.
- Every grid on the site carried `transition: all 0.5s`, so layouts animated whenever anything changed.

### Fixed in this pass (pass 1)
| Where | What |
| --- | --- |
| Whole site | Declared light-only (`color-scheme: only light` in CSS and as a meta tag); browser bar always white; toasts fixed to light; autofill fields stay white; grid transition removed; scrollbar is neutral grey instead of red-pink |
| Fonts | Inter, then the Bengali font, then system. Taka sign and Bengali text now come from the shop's own font everywhere |
| Bottom bar (phones) | The fifth item (Login) was off the screen on 320px phones; a strip of the bar stayed visible after it hid on scroll; the hook order changed between pages. Rebuilt as one solid bar, five items fit at 320px |
| Product card | The base card put 24px between its parts, leaving empty bands above the name and above the buttons. Removed. Buy Now and the cart button are 40px tall and fit two-across at 320px. Two scent labels on phones (three were cut off at both ends) |
| Section headings | Bouncing dots, pulsing sparkle and pink band removed. One calm heading with a short green line |
| Home product rows | Same side margin as the rest of the page; the third card peeks in to show the row scrolls |
| Product page | Add to Cart is brand green; Buy Now is the same red as on the cards (they were blue-purple and orange-pink); selected size, title line and "Read more" use green; price box is neutral; the sticky buy bar is solid (the description text showed through it) |

### Deployed
- Live storefront after pass 1 was `25bb3ec` (was `1520cd7`); after pass 2 it was `92a43a2`; after pass 3 it was `414ba38`; after pass 4 it was `9d5c9b8`; after pass 5 it is `1af5992`. Rollback copy of the previous build: `~/deploy-backups/khushbuwaala-frontend-next-20261124-103834`.
- Checked on the live site after the deploy, with dark mode emulated: page stays light (`color-scheme: light only`), white browser-bar tag, five bottom-bar items inside 320px, font order Inter → Noto Serif Bengali → stand-in, product page buttons in the new colours. Home, shop, product, cart, checkout and wishlist answer 200.
- `adjustFontFallback: false` did nothing in the production build, so the font order is written out in `globals.css` instead.

### Pass 2, same day: cart drawer, cart page, checkout (live as `92a43a2`)
| Where | What was wrong | Fix |
| --- | --- | --- |
| Cart page | The saved cart was read before the page had started in the browser, so the server's "0 items" and the browser's real count disagreed. The page was thrown away and drawn again on every visit, and "Your cart is empty" flashed for shoppers with items | The page draws a short placeholder first, then the real cart |
| Checkout | Same redraw on every visit | Same fix |
| Checkout with nothing in the cart | Showed "0 items", a ৳60 total and a live Place Order button | Shows "Your cart is empty" with a button to the shop |
| Cart page | Line prices read "৳1350.00" while the summary read "৳ 1,350" | Whole taka with separators everywhere |
| Cart drawer | A second subtotal sat under the close button | Removed; the subtotal is shown once, at the bottom |
| Cart, checkout, thank-you | "1 items" | "1 item" |

Checked: cart and checkout with one item on the local test copy at 390px (checkout also at 320px); empty cart and empty checkout on the live site at 390px. Not checked: placing an order, form validation messages, quantity and remove buttons, tablet and desktop widths. The checkout with an item was looked at before the last small change (the empty-cart message), not after it.

### Pass 3, same day (live as `414ba38`)
| Where | What was wrong | Fix |
| --- | --- | --- |
| Checkout (my own regression from pass 2) | The sticky Place Order bar no longer hid when the in-page button was on screen, and the name field lost its focus: both were set up before the form existed. Live for about an hour | Set up again once the form is drawn (`0fac279`) |
| Checkout delivery charge | With no district chosen, an order under ৳1,000 went through at the Dhaka rate (৳60) wherever it was going | District is required when it sets the charge; both rates shown beside the field; a note under Delivery Fee until one is chosen; Dhaka first in the list. Checked: ৳360 + Chattogram = ৳480 |
| Checkout | "Shipping: Inside Dhaka (৳60)" showed even on free-delivery orders | Says "Free delivery" |
| Cart item buttons | No names for screen readers, 32–34px | Named, 40px |
| Menu drawer | Blue-purple Track Order button, pink header | Green, plain |
| Small text | Discount badge 10px, scent labels and old price 11px, cart count 9px | 11–12px |

Looked at and found fine: shop filters, search drawer, thank-you page (with a made-up local order), home / shop / product at desktop width in real Chrome on the live site.

Seen once and not reproduced: the live checkout stayed on its loading placeholder in real Chrome a few minutes after a restart. Five further loads were normal.

### Pass 4, same day (live as `9d5c9b8`)
| Where | What was wrong | Fix |
| --- | --- | --- |
| Shipping policy | Said ৳70 inside Dhaka, ৳100 outside, 2–5 working days. Checkout charges ৳60 / ৳120, free from ৳1,000 | States the checkout charges and the owner's times (within 1 day in Dhaka, 1–2 days outside); no sideways-scrolling table |
| Contact page | Was a copy of the store locator | Call, WhatsApp, Messenger, email, showroom, order tracking |
| Showroom page | "stores across Dhaka" (there is one) and "Coming soon: Chittagong and Sylhet" (unconfirmed) | One showroom; the coming-soon line removed |
| Click & Collect | Pickup address was a Banani address that is not the shop's | Real showroom address |
| Sign-in and sign-up | Serif heading, black text on the green button, generic tab title | Same heading font and green button as the rest; "Sign in" title |
| Not-found page | Bare page, black button, a "try searching" line that was not a link | Buttons to the shop and home, links to order tracking and contact |

Looked at and found fine at 390px: a category page, wishlist (empty), track order, about, refund policy, terms. Product page gallery, size change and quantity work and prices follow. Shop sorting works.

Needs the owner (see TASKS): Click & Collect, Careers, News, the empty blog, opening hours.

### Pass 5, same day (live as `1af5992`)
Owner's answers (2026-11-24): pickup is not offered, remove Click & Collect; the Careers jobs and the News items were sample content; the blog is fed from the admin panel and stays; opening hours (10 AM – 10 PM daily) and delivery outside Bangladesh on request are correct.

| Where | What was wrong | Fix |
| --- | --- | --- |
| Click & Collect, News | Sample pages promising things that are not offered | Removed; `/click-collect` leads to `/stores`, `/news` to `/blog`; footer links removed |
| Careers | Two sample jobs and a "Hiring" badge | Page says no positions are open and how to send a CV. My reading of "keep it, but it is dummy": keep the page, drop the made-up jobs |
| Quick view (desktop) | A product on sale at ৳550 showed ৳880 and went into the cart at ৳880: quick view ignored the sale that product lists carry. Add to Cart was red and Buy Now green, the reverse of everywhere else | Sale price shown and charged (seen on the live site: ৳550, "Save ৳330"); colours match |
| Hero banner | The box was a thin strip (up to 5:1) while the artwork is 2:3 / 3:2, so under a third of each picture showed and the offer text was cut apart | Phone box is square, desktop 2.2:1 inside the page width. Seen on the live site at 390px and at desktop width |

Nobody was overcharged by the quick view fault: for website orders the backend works out every price, the delivery charge and the total itself (`priceWebsiteOrder` in `order.service.ts`) and ignores what the browser sends. The fault was what the shopper saw (৳880 in quick view, cart and checkout summary), which could have put them off buying.

### How it was checked
- Looked at on the local test copy at 320px and 390px (home, shop, product) and at 1440px scaled down (home, product). Not on real phones.
- Not yet inspected: cart, checkout, thank-you and every other route (see the checklist).

### Work computer
- Drive D: had 0.6 GB free; the storefront's local dev cache (`.next/dev`, 5.4 GB, rebuilt automatically) was deleted so the test copy could start. The admin project has a similar 4.6 GB cache that can go the same way.

## Session 6 — 2026-11-23 night (after the owner paid Google Cloud and Meta)

### Tagging server: paid, still down at 20:30 Dhaka
- Billing page: last payment $9.48 on Nov 23, balance $0.83, no overdue warning, card no longer shows "declined".
- The service still answers 500/503 and the newest log line (20:09 Dhaka) still says "The request failed because billing is disabled for this project." Google has not switched the project back on yet.
- If it is still down the next morning: Google Cloud → Billing → Your projects → the three dots beside `khushbuwaala-sgtm` → Change billing → choose "Khushbuwaala SGTM Billing A/C" again. Then check `https://sgtm.khushbuwaala.com/healthy` answers `ok`. GA4 was not checked because nothing reaches it until then.

### Merchant Center (account 5532933892): shop feed added
- New product source "PRODUCTS SOURCE 2": `https://api.khushbuwaala.com/api/products/google-shopping-feed.xml`, country **Bangladesh only**, English, feed label `BD`, fetched every 24 hours at midnight. Source id 10800026629.
- Feed checked before adding: 993 items, all with price in BDT, image, brand, condition, availability (925 in stock, 68 out).
- First fetch: file accepted with no file issues, **941 products** taken in. Why 52 were not taken in is not known yet.
- Right after the fetch the "Needs attention" list shows 980 products; the rows on screen were the old Google-found products with "Missing product price". New products take Google up to about 3 working days to review, so the real approved count is **not known yet**.
- The old source "Found by Google" (30 products, mixed countries) was left as it is.
- Shipping policy already there for Bangladesh, left unchanged: flat ৳50, free over ৳1,000, delivery 0–1 working days. The shop really charges ৳60 inside Dhaka and ৳120 outside (free over ৳1,000). Google does not allow showing a lower delivery charge than the real one, so this needs the owner's decision (see TASKS).

### Merchant Center delivery charge corrected (owner's figures, same evening)
- Owner confirmed the real charges: ৳60 inside Dhaka (within 1 day), ৳120 outside Dhaka (1–2 days), free over ৳1,000 in both.
- Merchant Center offers only one rate for the whole of Bangladesh (the destination list has "All destinations" only; the cost table splits by price, weight or item count, not by area). Google's rule is that the charge shown must not be lower than the real one, so the policy now shows the higher figure: **flat ৳120, free over ৳1,000, 1–2 business days** (handling 0–1, transit 1). Read back from the saved policy.
- Dhaka buyers therefore see ৳120 on Google but pay ৳60 at checkout. That is allowed (showing more than the real charge is fine, showing less is not).
- Tagging server rechecked at about 21:00 Dhaka: still 503.

### Tagging server after the owner reopened the billing account (about 23:45–00:25 Dhaka)
- Billing → Your projects shows `khushbuwaala-sgtm` linked to "Khushbuwaala SGTM Billing A/C"; the account shows "Paid account", no warning.
- The error changed from "billing is disabled for this project" to "the instance could not start successfully", then the server started: `/healthy` answered 200.
- **GA4 confirmed receiving** (Realtime, property KhushbuWaala): my own visits from Dhaka showed `page_view` (2) and `view_item` (1). In the browser the requests to the tagging server returned 200.
- **Not stable yet:** it answered for 2–3 minutes, then about 10 minutes of 503 ("The service you requested is not available yet. Please try again in 30 seconds."), then up again, then down again. During the down periods the container log shows the server still running and no failed requests reaching it, so the refusals come from Google's front door, not from our server. This looks like Google still switching the project back on. Nothing in our set-up was changed.
- Not tested yet in GA4: add_to_cart and the seven new shop events.

### Tagging server steady again (checked 2026-11-24, about 16:10–16:20 Dhaka)
- `/healthy` answered 200 on 63 checks in a row over about 10 minutes, no failures (the night before it never stayed up longer than about 3 minutes). Nothing was changed on our side; Google finished switching the project back on.
- GA4 Realtime shows real visitors again: 4 users in the last 30 minutes, events page_view (9), view_item (5), first_visit (3), session_start (3), select_item (2), user_engagement (2).
- GA4 has **no shop data from about Nov 8 to the night of Nov 23**. That gap cannot be filled in afterwards.
- Still not seen in GA4: add_to_cart, begin_checkout, purchase and the seven new shop events (no one did those in the minutes I watched).

### This computer
- Drive C: is full (0 MB free of 200 GB). A download was cut short because of it; work files now go to `D:\Projects\khushbuwaala\_dev\tmp`. The owner needs to free space on C:.

## Session 5 — 2026-11-23 evening (tracking accounts: Google Cloud, Tag Manager, Meta) — DEPLOYED

**Live now:** backend `6a5a320`, storefront `1520cd7`, admin `34c8a66`. Tag Manager web container **version 17** (version 13 was live before this session; it is the rollback point in Tag Manager → Versions). Storefront rollback copy: `~/deploy-backups/khushbuwaala-frontend-20261123-140737`.

Also shipped earlier today and not written up before: thank-you page survives a refresh (`863eb8a`, key `kw_last_order` in session storage); Lighthouse fixes (`c86a334`, Tag Manager loads with `lazyOnload`); admin "Fragrance data check" screen (backend `6a5a320`, admin `34c8a66`).

### Tagging server (sGTM): cause found, blocked on a payment
- Cloud Run request log says, word for word: "The request failed because billing is disabled for this project." The container itself is fine; the earlier guess (bad image) was wrong.
- Google Cloud → Billing → "Khushbuwaala SGTM Billing A/C": overdue balance **$10.31**, Visa ending 0188 "Transaction declined". Cost stopped on Nov 8, which matches the drop in Meta events from Nov 9.
- **Owner action:** pay the balance (Billing → Pay now, or fix the card with the bank). The service should come back by itself; then check `https://sgtm.khushbuwaala.com/healthy` answers `ok`. Until then GA4 receives nothing from the shop (every GA4 hit goes through this server) and Meta gets browser events only, plus the Purchase the backend sends directly.

### Tag Manager (web container GTM-KDFMX5QL), versions 14 → 17
| What was wrong | Fix | Checked how |
| --- | --- | --- |
| Meta browser Purchase used the bare order number as its event ID; the backend sends `kw_<orderId>`. The two never matched, so Meta could count an order twice | Purchase tag Event ID now reads `event_id` from the data layer (`kw_<orderId>`) | Live container script; **not yet seen on a real order** |
| Meta ViewContent, AddToCart, InitiateCheckout sent no value, currency or product IDs | Each now sends value, currency, content_ids, contents, content_type=product | Meta Test Events: ViewContent arrived with value 1350, BDT, the product ID; AddToCart arrived. InitiateCheckout **not tested** |
| Base pixel sent a nameless custom event on every page load (shown in Meta as `__missing_event`, about 2,000 in 28 days) and no PageView | Base pixel now sends PageView | Meta Test Events: PageView on load, no more `__missing_event` |
| No tags for the new shop events | One GA4 tag "GA4 shop events Tag" for view_item_list, view_cart, remove_from_cart, add_shipping_info, add_payment_info, search, add_to_wishlist (event name from the data layer, ecommerce data on, `search_term`); one Meta tag "FB Search Tag" | GA4 requests for view_cart seen leaving the browser; **delivery to GA4 cannot be confirmed while sGTM is down**. Meta Search **not tested** |

**Mistake made and corrected in this session:** version 14 switched the three Meta tags to the template's "Enhanced Ecommerce / GA4 dataLayer" mode. That mode expects the old Universal Analytics data shape, so the tags failed silently. ViewContent was broken from about 19:43 to 20:00 Dhaka (version 15), AddToCart and InitiateCheckout until about 20:02 (version 16). Roughly 20–35 minutes of those three Meta browser events were lost (longer for browsers that had the script cached, up to about 15 minutes more). Do not tick those two boxes on this template.

### Storefront: events sent before Tag Manager loads were lost for Meta (`1520cd7`)
- Since `c86a334` Tag Manager loads late (for speed). A product view pushed during page load was replayed before Tag Manager's start-up step and Meta never showed it; the same event sent after start-up arrived. Seen in Meta Test Events.
- New `src/lib/Analytics/dataLayerGate.ts`: `kwDataLayerPush` holds events until Tag Manager is running, then hands them over in order (gives up waiting after 20 s). Used by `kwEcom.ts` and `ViewItemDataLayer.tsx`.
- After the deploy: ViewContent on first page load shows in Meta Test Events as Processed with its parameters.
- From the `c86a334` deploy earlier on 2026-11-23 until about 20:10 Dhaka this also means **landing-page ViewContent and checkout-page InitiateCheckout did not reach Meta from the browser** during those hours.

### Found, not changed
- Six Meta datasets exist in the business account; the shop uses `1100344042124349`.
- Meta event match quality is 6.1/10 (Purchase 7.5). Advanced matching is off on the browser tags.
- Product pages prefetch about 40 other pages on load (visible in the network list). Worth a look for data use on phones.
- The in-app test browser runs pages in the background and sometimes does not run page scripts; use real Chrome for tracking checks.

### Search Console and Merchant Center (read only, nothing changed)
- Search Console: the Domain property `khushbuwaala.com` is verified. `sitemap.xml` was last read on 2026-11-23, status Success, 153 pages discovered (the sitemap now lists 183; Google has not re-counted yet). An old entry `sitemap_index.xml` from 2021 shows "Couldn't fetch"; it can be removed there.
- Merchant Center (account 5532933892): only **30 products**, 2 approved, 28 not approved, 24 of them for a missing price. The shop's own feed has 993 items, so Merchant Center is not reading it. The store is set up for United Kingdom, India and United States, not Bangladesh. This needs a decision and set-up (see TASKS).

### Not done in this session
- Meta tags for AddToWishlist and AddPaymentInfo (events are in the data layer; no tag yet).
- GA4 was not opened (it has no shop data while the tagging server is down).
- Fragrance data check not opened on the live admin.

## Session 4 — 2026-11-23 (home page, speed, admin-managed content, landing pages) — DEPLOYED

**Live now:** backend `ca429d1`, storefront `da1bd63`, admin `75b1684`. Latest rollback copies in `~/deploy-backups`: `backend-dist-20261123-115133`, `storefront-next-20261123-120318`, `admin-next-20261123-115219`.

**Home page rebuilt (server-rendered)**
- Product rows come from the discovery API on the server: 41 product links in the HTML (was 0), one main heading, built ahead of time and refreshed every minute.
- New "Not sure which perfume? Start with what you like" section (18 one-tap ways into the collection) and a brand-story block using the agreed wording (since 2020, 8+ years in fragrance).
- Removed: the newsletter form (it posted to an address that does not exist, so nothing was ever saved) and the blog page's "Subscribed!" box (it did nothing at all). "Support 24/7" replaced by what the shop actually offers.

**Speed**
- A card's second photo is fetched only on hover or swipe. It used to download for every card in view, doubling image data on phones.
- Category grid and section headings no longer wait for JavaScript to become visible; the animation library is no longer loaded on the home page (about 130 KB less script: 1.18 MB → 1.05 MB uncompressed for the home page).
- Listings hand cards only the fields they use; home HTML 1.14 MB → 0.87 MB (53 KB compressed).
- Product pages are prebuilt (135 at build time) and refreshed every 5 minutes; a price or stock change used to take up to an hour to show.
- Not measured: Lighthouse / Core Web Vitals. The numbers above are file sizes, not lab scores.

**Admin-managed storefront content (new)**
- Admin → **Home page content** (`/storefront`, admin and super admin): announcement bar messages, hero banners (upload, phone picture, button text and link, description) and the home page product rows (title, which products, order, show/hide). Rows are picked from ready-made choices (best sellers, newest, on offer, a collection, with oud, under ৳500…), no filter text to type.
- Backend `/api/storefront/settings`: every save is checked (shop-internal links only, pictures only from the site or our image host, valid product selections); a bad entry is named and nothing is saved. Until the owner saves, the shop shows exactly what it showed before.
- Storefront reads it on the server (refreshed every minute) with the same content built in as a fallback.
- Verified: 7 unit tests; locally in the browser (edit, reorder, save, public read); **on live against the real database 6/6** (save, second save updates the same document, bad banner refused, public read), then the test document was removed so the shop is on its built-in content again.

**Scent and note landing pages (new, indexable)**
- `/scents/<family>` for all 18 families and `/notes/<note>` for 12 popular notes, each with its own heading, intro and description (`src/config/scentPages.ts`). In the sitemap (183 URLs now). A page with fewer than 4 perfumes marks itself noindex.
- The product page's "at a glance" block and the home "start with what you like" section link to these pages, so search engines can follow them.

**Clean-up**
- 36 unreachable storefront files removed after an import-graph check (old in-storefront dashboard leftovers, duplicate API files, a broken cart badge).
- `/api/orders` on the storefront answered every POST with a made-up order id; removed (nothing used it). `proxy.ts` only redirected signed-in admins to `/dashboard`, which no longer exists; removed.
- One accurate Organization block for search engines (showroom address, real social links, founded 2020); the unconfirmed opening hours and a guessed Twitter link were dropped; the footer's duplicate block removed.
- `npm run lint` works again (`eslint src`): 284 existing problems, not yet worked through. Type errors 100 → 36.

**Checks this session**
- Backend: tsc 0, lint 0, **69/69** tests. Admin: tsc 0, lint 0, build OK. Storefront: build OK (205 prebuilt pages).
- Live after the last deploy: key pages 200, **135/135 product pages 200**, scent/note pages 200 with products, unknown ones 404, filtered views noindex, product page served from cache.

## Session 3 — 2026-11-23 (test order, guest-cart bug, checkout tracking) — DEPLOYED

**Live now:** backend `aa8c3ab`, storefront `9feb34d`. Rollback copies: `backend-dist-20261123-105720`, `storefront-next-20261123-105656` and `-110046`.

**P0 bug found and fixed: every guest shared one cart row per product**
- How it showed: one tap on "Add to Cart" as a guest put **quantity 3** in the cart. The server looked up a guest's cart row by "no user", so all visitors without an account hit the same row; it added 1 to the running total of every earlier guest and sent that total back, and the storefront displayed it. 144 such shared rows existed on live.
- Also wrong: `GET /cart` without login returned every visitor's open cart rows; anyone could change or delete any cart row by id, including a signed-in customer's.
- Fix (backend `aa8c3ab`): a guest is matched only to the row that visitor created earlier (its id is kept on the device and sent back); a guest `GET /cart` returns nothing; a customer's row can only be changed by that customer or staff; rows that became order lines can never be changed through the cart; quantity must be 1–999.
- Fix (storefront `0ec7874`): for a guest the server's quantity never overwrites what the visitor chose; only the row id is remembered.
- Verified live: first guest add → quantity 1; a second "visitor" gets a separate row; the same visitor adding 2 more → 3 on their own row; quantity 0 or −4 refused; deleted rows 404. In the browser: one tap → quantity 1.
- Not cleaned: the 144 old shared rows are still in the database (they only appear on the admin Carts page). Left in place; see TASKS.

**Test order (owner approved) — #766624, cash on delivery, ৳210 (Axe Signature 3 ml ৳150 + ৳60 Inside Dhaka)**
- Placed on the live site from a phone-sized browser as `[TEST-CLAUDE] Test Order`, phone = the shop's own number, no email.
- Events seen in the browser, each once and with an event id: view_item (280) → select_item (150) → add_to_cart (150) → view_cart (150) → begin_checkout (150) → add_shipping_info (210, "Inside Dhaka") → add_payment_info (210, cod) → purchase (210, shipping 60, transaction id = order id, event id `kw_<orderId>`).
- **Refreshing the thank-you page did not fire purchase again.**
- **Meta server event: accepted.** Backend log: `[meta capi] Purchase kw_6b041c66… accepted` (HTTP 200 from Meta), same event id as the browser event. Whether Meta shows the pair as one de-duplicated purchase can only be seen in Events Manager (no access).
- Stock 68 → 65 ml on order; cancelled through the normal admin route → status CANCELED, `stockReturned` true, stock back to **68**.
- What the test left behind: one cancelled order #766624 with its guest customer record; one order-notification email to the shop's admin address; one ৳210 Purchase counted by Meta (browser + server) and attempted to GA4 (lost: tagging server down).
- Two tracking faults found by the test and fixed (storefront `9feb34d`): add_shipping_info fired twice (once on page load with a guessed district, again when the district was chosen) → now once, after a district is chosen; add_payment_info fired on page load → now after the delivery details; **online payments were reported as "cod"** (the code compared against a value that is never used) → now "online".
- Observed, not changed: after a refresh the thank-you page no longer shows the order details to a guest (by design the order lookup is owner/staff only); purchase items carry no item_category.

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
