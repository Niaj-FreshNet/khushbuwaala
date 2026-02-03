/* eslint-disable @typescript-eslint/no-explicit-any */
export type KwEcomItem = {
    item_id: string;
    item_name: string;
    item_brand?: string;
    item_category?: string;
    item_variant?: string;
    price?: number;
    quantity?: number;
};

declare global {
    interface Window {
        dataLayer?: any[];
    }
}

function kwEventId() {
    return `${Date.now()}.${Math.random().toString(16).slice(2)}`;
}

export function kwPushAddToCart(params: {
    currency?: string;
    value?: number;
    items: KwEcomItem[];
}) {
    if (typeof window === "undefined") return;

    const currency = params.currency ?? "BDT";
    const value = params.value;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: "add_to_cart",
        event_id: kwEventId(), // ✅ used for Meta dedup (browser + server)
        ecommerce: {
            currency,
            value,
            items: params.items,
        },
    });
}


// @/lib/Analytics/kwEcom.ts

type KWItem = {
    item_id: string
    item_name?: string
    item_brand?: string
    item_category?: string
    item_variant?: string
    price?: number
    quantity?: number
}

type KWUserData = {
    em?: string
    ph?: string
    fn?: string
    ln?: string
    external_id?: string
    ct?: string
    st?: string
    country?: string
    zip?: string
}

type KWBeginCheckoutPayload = {
    currency: string
    value: number
    items: KWItem[]
    coupon?: string
    user_data?: KWUserData
}

const safeNum = (n: any) => {
    const x = Number(n)
    return Number.isFinite(x) ? x : 0
}

const makeEventId = () => {
    // stable-enough unique id for dedupe (also used for Meta dedup)
    return `kw_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

const normEmail = (v?: string) => {
    const s = String(v || "").trim().toLowerCase()
    return s || undefined
}

const normPhoneBD = (v?: string) => {
    // Accept: 01XXXXXXXXX or +8801XXXXXXXXX
    const raw = String(v || "").trim()
    const digits = raw.replace(/\D/g, "")
    if (!digits) return undefined

    // If starts with 880 already
    if (digits.startsWith("880")) return `+${digits}`

    // If starts with 0 and looks like BD mobile (11 digits)
    if (digits.startsWith("0") && digits.length === 11) return `+88${digits}`

    // fallback
    if (digits.length >= 10) return `+${digits}`
    return undefined
}

const splitName = (full?: string) => {
    const s = String(full || "").trim()
    if (!s) return { fn: undefined, ln: undefined }
    const parts = s.split(/\s+/).filter(Boolean)
    if (parts.length === 1) return { fn: parts[0], ln: undefined }
    return { fn: parts[0], ln: parts.slice(1).join(" ") }
}

const getCookie = (name: string) => {
    if (typeof document === "undefined") return undefined
    const m = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`))
    return m ? decodeURIComponent(m[1]) : undefined
}

const getFbp = () => getCookie("_fbp")
const getFbc = () => getCookie("_fbc")

const getEventSourceUrl = () => {
    if (typeof window === "undefined") return undefined
    return window.location.href
}

const makeCheckoutFingerprint = (p: KWBeginCheckoutPayload) => {
    // fingerprint by cart content so we don't re-fire begin_checkout for same cart
    const parts = (p.items || []).map(i =>
        [
            String(i.item_id || ""),
            String(i.item_variant || ""),
            String(safeNum(i.price)),
            String(safeNum(i.quantity || 1)),
        ].join("|")
    )
    parts.sort()
    return `${p.currency}|${safeNum(p.value)}|${parts.join("~")}`
}

const shouldSkip = (fingerprint: string) => {
    try {
        const key = "kw_begin_checkout_fp"
        const prev = sessionStorage.getItem(key)
        if (prev && prev === fingerprint) return true
        sessionStorage.setItem(key, fingerprint)
        return false
    } catch {
        return false
    }
}

export function kwPushBeginCheckout(payload: KWBeginCheckoutPayload) {
    if (typeof window === "undefined") return
    if (!payload?.items?.length) return

    const currency = payload.currency || "BDT"
    const value = safeNum(payload.value)
    const coupon = payload.coupon ? String(payload.coupon).trim().toUpperCase() : undefined

    const items = payload.items.map(i => ({
        item_id: String(i.item_id),
        item_name: i.item_name ? String(i.item_name) : undefined,
        item_brand: i.item_brand ? String(i.item_brand) : undefined,
        item_category: i.item_category ? String(i.item_category) : undefined,
        item_variant: i.item_variant ? String(i.item_variant) : undefined,
        price: safeNum(i.price),
        quantity: Math.max(1, safeNum(i.quantity || 1)),
    }))

    const fp = makeCheckoutFingerprint({ currency, value, items })
    if (shouldSkip(fp)) return

    const event_id = makeEventId()

    const content_ids = items.map(i => i.item_id)
    const contents = items.map(i => ({
        id: i.item_id,
        quantity: i.quantity,
        item_price: i.price,
    }))

    const meta = buildMetaBlock(payload.user_data)

        ; (window as any).dataLayer = (window as any).dataLayer || []
        ; (window as any).dataLayer.push({ ecommerce: null })

        ; (window as any).dataLayer.push({
            event: "begin_checkout",
            event_id,
            event_time: Math.floor(Date.now() / 1000),

            ecommerce: {
                currency,
                value,
                coupon,
                items,
            },

            coupon,

            // For Meta mapping in GTM + sGTM
            meta_event_name: "InitiateCheckout",
            content_type: "product",
            content_ids,
            contents,
            num_items: items.reduce((s, i) => s + (i.quantity || 1), 0),
            value,
            currency,

            ...meta,
        })
}

const normalizeItems = (items: KWItem[]) =>
    (items || []).map(i => ({
        item_id: String(i.item_id),
        item_name: i.item_name ? String(i.item_name) : undefined,
        item_brand: i.item_brand ? String(i.item_brand) : undefined,
        item_category: i.item_category ? String(i.item_category) : undefined,
        item_variant: i.item_variant ? String(i.item_variant) : undefined,
        price: safeNum(i.price),
        quantity: Math.max(1, safeNum(i.quantity || 1)),
    }))

const metaContents = (items: ReturnType<typeof normalizeItems>) => ({
    content_ids: items.map(i => i.item_id),
    contents: items.map(i => ({
        id: i.item_id,
        quantity: i.quantity,
        item_price: i.price,
    })),
    num_items: items.reduce((s, i) => s + (i.quantity || 1), 0),
})

const dlPush = (obj: any) => {
    if (typeof window === "undefined") return
        ; (window as any).dataLayer = (window as any).dataLayer || []
        ; (window as any).dataLayer.push(obj)
}

const buildMetaBlock = (user_data?: KWUserData) => {
    const em = normEmail(user_data?.em)
    const ph = normPhoneBD(user_data?.ph)

    // If fn/ln not provided but full name is in fn, split it
    const split = splitName(user_data?.fn)
    const fn = String(user_data?.fn || "").includes(" ") ? split.fn : (user_data?.fn ? String(user_data.fn).trim() : undefined)
    const ln = String(user_data?.fn || "").includes(" ") ? split.ln : (user_data?.ln ? String(user_data.ln).trim() : undefined)

    return {
        user_data: {
            em,
            ph,
            fn: fn ? String(fn).trim() : undefined,
            ln: ln ? String(ln).trim() : undefined,
            external_id: user_data?.external_id ? String(user_data.external_id) : undefined,
            ct: user_data?.ct ? String(user_data.ct).trim() : undefined,
            st: user_data?.st ? String(user_data.st).trim() : undefined,
            country: user_data?.country ? String(user_data.country).trim().toLowerCase() : "bd",
            zip: user_data?.zip ? String(user_data.zip).trim() : undefined,
        },
        fbp: getFbp(),
        fbc: getFbc(),
        event_source_url: getEventSourceUrl(),
    }
}


/** =========================
 * add_shipping_info
 * ========================= */
export function kwPushAddShippingInfo(payload: {
  currency?: string
  value: number
  items: KWItem[]
  shipping_tier: string
  coupon?: string
  user_data?: KWUserData
}) {
  if (typeof window === "undefined") return
  if (!payload?.items?.length) return

  const event_id = makeEventId()
  const currency = payload.currency || "BDT"
  const value = safeNum(payload.value)
  const coupon = payload.coupon ? String(payload.coupon).trim().toUpperCase() : undefined

  const items = normalizeItems(payload.items)
  const { content_ids, contents, num_items } = metaContents(items)

  const meta = buildMetaBlock(payload.user_data)

  dlPush({ ecommerce: null })
  dlPush({
    event: "add_shipping_info",
    event_id,
    event_time: Math.floor(Date.now() / 1000),

    ecommerce: {
      currency,
      value,
      shipping_tier: payload.shipping_tier,
      coupon,
      items,
    },

    coupon,

    meta_event_name: "AddShippingInfo",
    content_type: "product",
    content_ids,
    contents,
    num_items,
    value,
    currency,
    shipping_tier: payload.shipping_tier,

    ...meta,
  })
}

/** =========================
 * add_payment_info
 * ========================= */
export function kwPushAddPaymentInfo(payload: {
  currency?: string
  value: number
  items: KWItem[]
  payment_type: string
  coupon?: string
  user_data?: KWUserData
}) {
  if (typeof window === "undefined") return
  if (!payload?.items?.length) return

  const event_id = makeEventId()
  const currency = payload.currency || "BDT"
  const value = safeNum(payload.value)
  const coupon = payload.coupon ? String(payload.coupon).trim().toUpperCase() : undefined

  const items = normalizeItems(payload.items)
  const { content_ids, contents, num_items } = metaContents(items)

  const meta = buildMetaBlock(payload.user_data)

  dlPush({ ecommerce: null })
  dlPush({
    event: "add_payment_info",
    event_id,
    event_time: Math.floor(Date.now() / 1000),

    ecommerce: {
      currency,
      value,
      payment_type: payload.payment_type,
      coupon,
      items,
    },

    coupon,

    meta_event_name: "AddPaymentInfo",
    content_type: "product",
    content_ids,
    contents,
    num_items,
    value,
    currency,
    payment_type: payload.payment_type,

    ...meta,
  })
}

/** =========================
 * purchase (fire ONCE)
 * ========================= */
const purchaseShouldSkip = (transaction_id: string) => {
    try {
        const key = `kw_purchase_${transaction_id}`
        if (sessionStorage.getItem(key) === "1") return true
        sessionStorage.setItem(key, "1")
        return false
    } catch {
        return false
    }
}

export function kwPushPurchase(payload: {
  transaction_id: string
  event_id: string
  currency?: string
  value: number
  tax?: number
  shipping?: number
  items: KWItem[]
  coupon?: string
  user_data?: KWUserData

  // ✅ add these (optional but best)
  shipping_data?: {
    email?: string
    phone?: string
    name?: string
    district?: string
  }
}) {
  if (typeof window === "undefined") return
  if (!payload?.items?.length) return
  if (!payload.transaction_id) return
  if (purchaseShouldSkip(payload.transaction_id)) return

  const event_id = payload.event_id
  const currency = payload.currency || "BDT"
  const value = safeNum(payload.value)
  const tax = safeNum(payload.tax)
  const shipping = safeNum(payload.shipping)
  const coupon = payload.coupon ? String(payload.coupon).trim().toUpperCase() : undefined

  const items = normalizeItems(payload.items)
  const { content_ids, contents, num_items } = metaContents(items)

  const meta = buildMetaBlock(payload.user_data)

  dlPush({ ecommerce: null })
  dlPush({
    event: "purchase",
    event_id,
    event_time: Math.floor(Date.now() / 1000),

    ecommerce: {
      transaction_id: payload.transaction_id,
      currency,
      value,
      tax,
      shipping,
      coupon,
      items,
    },

    coupon,

    // ✅ So your DLVs like shipping.email work
    shipping: {
      email: payload.shipping_data?.email,
      phone: payload.shipping_data?.phone,
      name: payload.shipping_data?.name,
      district: payload.shipping_data?.district,
    },

    meta_event_name: "Purchase",
    content_type: "product",
    content_ids,
    contents,
    num_items,
    value,
    currency,
    order_id: payload.transaction_id,
    customer_id: payload.user_data?.external_id,

    ...meta, // ✅ CRITICAL for sGTM match quality
  })
}