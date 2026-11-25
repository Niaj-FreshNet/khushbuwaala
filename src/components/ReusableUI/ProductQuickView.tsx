"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react"

import type { ListDiscount, ProductCardProduct } from "@/types/product.types"
import { activeAutoDiscount, offeredVariants, pickStartingVariant } from "@/lib/productPricing"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { kwPushAddToCart, kwPushBeginCheckout, kwCategoryName } from "@/lib/Analytics/kwEcom"

type QuickViewVariant = NonNullable<ProductCardProduct["variants"]>[number]

interface ProductQuickViewProps {
  product: ProductCardProduct
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const MAX_QUANTITY = 10
const NO_IMAGE = "/placeholder.svg?height=800&width=800&text=No+Image"

// The sign is written by hand: Safari puts it after the number when Intl formats BDT.
const formatPrice = (price: number) => "৳" + Math.round(Number(price) || 0).toLocaleString("en-US")

const sizeLabel = (v: QuickViewVariant) => `${v.size} ${String(v.unit || "").toLowerCase()}`.trim()

function priceAfter(price: number, discount: ListDiscount | null): number {
  if (!discount) return price
  const value = Number(discount.value ?? 0)
  let final = price
  if (discount.type === "percentage") final = price - (price * value) / 100
  else if (discount.type === "fixed") final = price - value
  return Math.max(0, Math.round(final))
}

/**
 * A product at a glance, without leaving the list: picture, price, size, quantity and the two
 * buy buttons. It opens on the same size and price as the card that opened it.
 */
export function ProductQuickView({ product, trigger, open, onOpenChange }: ProductQuickViewProps) {
  const router = useRouter()
  const cart = useCart()
  const wishlist = useWishlist()

  const sizes = React.useMemo(() => offeredVariants(product.variants), [product.variants])
  const startingSize = React.useMemo(() => pickStartingVariant(product.variants), [product.variants])

  const [selectedId, setSelectedId] = React.useState<string | undefined>(startingSize?.id)
  const [quantity, setQuantity] = React.useState(1)
  const [imageIndex, setImageIndex] = React.useState(0)
  const [brokenImages, setBrokenImages] = React.useState<Record<string, true>>({})
  const [busy, setBusy] = React.useState<"cart" | "buy" | null>(null)
  const [justAdded, setJustAdded] = React.useState(false)

  // A different product in the same window: start again from its own default size.
  React.useEffect(() => {
    setSelectedId(startingSize?.id)
    setQuantity(1)
    setImageIndex(0)
    setJustAdded(false)
  }, [product.id, startingSize?.id])

  const images = React.useMemo(() => {
    const list = [product.primaryImage, ...(product.otherImages ?? [])].filter((src): src is string => Boolean(src))
    return list.length ? list : [NO_IMAGE]
  }, [product.primaryImage, product.otherImages])
  const shownImage = brokenImages[images[imageIndex]] ? NO_IMAGE : images[imageIndex]

  const selected = sizes.find((v) => v.id === selectedId) ?? startingSize ?? undefined
  const selectedLabel = selected ? sizeLabel(selected) : ""

  // The running sale: the product's own sale list when it is there (per size), otherwise the one
  // ready-made `discount` that product lists carry. Coupon codes are never shown as a sale.
  const saleFor = React.useCallback(
    (variant?: QuickViewVariant): ListDiscount | null => {
      const listSale = product.discount && typeof product.discount === "object" ? product.discount : null
      return activeAutoDiscount(product, variant) || listSale
    },
    [product]
  )

  const regularPrice = Number(selected?.price ?? product.minPrice ?? 0)
  const sale = saleFor(selected)
  const price = priceAfter(regularPrice, sale)
  const saving = Math.max(0, regularPrice - price)
  const saleLabel = !sale || saving <= 0
    ? null
    : sale.type === "percentage"
      ? `${Math.round(Number(sale.value ?? 0))}% off`
      : `${formatPrice(saving)} off`

  const isWishlisted = wishlist.isInWishlist?.(product.id) ?? false
  const productHref = `/product/${product.slug}`
  const close = () => onOpenChange?.(false)

  const analyticsItem = (qty: number) => ({
    item_id: String(product.id || product.slug || product.name),
    item_name: product.name,
    item_brand: product.brand || "Khushbuwaala",
    item_category: kwCategoryName(product),
    item_variant: selectedLabel || undefined,
    price,
    quantity: qty,
  })

  const handleAddToCart = () => {
    if (busy || !selected) return
    setBusy("cart")
    cart.addToCart(product, quantity, selectedLabel, price)
    kwPushAddToCart({ currency: "BDT", value: price * quantity, items: [analyticsItem(quantity)] })
    window.dispatchEvent(new CustomEvent("kw:cart-added"))
    setJustAdded(true)
    window.setTimeout(() => {
      setBusy(null)
      setJustAdded(false)
    }, 1400)
  }

  const handleBuyNow = () => {
    if (busy || !selected) return
    setBusy("buy")
    cart.addToCart(product, quantity, selectedLabel, price)
    kwPushBeginCheckout({ currency: "BDT", value: price * quantity, items: [analyticsItem(quantity)] })
    router.push("/checkout")
    close()
    window.setTimeout(() => setBusy(null), 1500)
  }

  const step = (by: number) => setImageIndex((i) => (i + by + images.length) % images.length)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="w-[94vw] max-w-[94vw] sm:max-w-2xl lg:max-w-4xl gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl">
        <div className="flex max-h-[90dvh] flex-col md:grid md:max-h-[640px] md:grid-cols-2">
          {/* Picture */}
          <div className="relative shrink-0 bg-stone-100 md:h-full">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] md:aspect-auto md:h-full md:min-h-[460px]">
              <Image
                key={shownImage}
                src={shownImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 94vw, 448px"
                className="object-cover object-top"
                onError={() => setBrokenImages((b) => ({ ...b, [images[imageIndex]]: true }))}
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous picture"
                    className="absolute left-2 top-1/2 grid h-9 w-9 min-h-0! -translate-y-1/2 place-items-center rounded-full bg-white/90 text-stone-800 shadow-sm transition hover:bg-white active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next picture"
                    className="absolute right-2 top-1/2 grid h-9 w-9 min-h-0! -translate-y-1/2 place-items-center rounded-full bg-white/90 text-stone-800 shadow-sm transition hover:bg-white active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                    {images.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setImageIndex(index)}
                        aria-label={`Show picture ${index + 1}`}
                        aria-pressed={index === imageIndex}
                        className={cn(
                          "relative h-11 w-11 min-h-0! overflow-hidden rounded-lg border-2 bg-white shadow-sm transition",
                          index === imageIndex ? "border-emerald-600" : "border-white/80 opacity-80 hover:opacity-100"
                        )}
                      >
                        <Image src={src} alt="" fill sizes="44px" className="object-cover object-top" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Bottom corners only: the product's name is printed at the top of its photo */}
              {saleLabel && (
                <span className="absolute bottom-3 left-3 rounded-md bg-white px-2 py-1 text-xs font-bold text-green-700 shadow-sm">
                  {saleLabel}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pt-5">
              <div className="pr-12">
                {product.category?.label || product.category?.categoryName ? (
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    {kwCategoryName(product)}
                  </p>
                ) : null}
                <DialogTitle className="mt-1 text-lg font-bold leading-snug text-stone-900 sm:text-xl">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Choose a size and quantity for {product.name}, then add it to your cart or buy now.
                </DialogDescription>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-2xl font-bold text-stone-900">{formatPrice(price)}</span>
                {saving > 0 && (
                  <>
                    <span className="text-sm text-stone-500 line-through">{formatPrice(regularPrice)}</span>
                    <span className="rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                      Save {formatPrice(saving)}
                    </span>
                  </>
                )}
                {selectedLabel && <span className="text-sm text-stone-500">for {selectedLabel}</span>}
              </div>

              {sizes.length > 1 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Size</p>
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((variant) => {
                      const active = variant.id === selected?.id
                      return (
                        <button
                          key={variant.id ?? sizeLabel(variant)}
                          type="button"
                          onClick={() => setSelectedId(variant.id)}
                          aria-pressed={active}
                          className={cn(
                            "min-h-0! rounded-xl border px-1 py-2 text-center transition active:scale-[0.98]",
                            active
                              ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                              : "border-stone-200 bg-white hover:border-stone-300"
                          )}
                        >
                          <span className={cn("block text-sm font-semibold", active ? "text-emerald-800" : "text-stone-800")}>
                            {sizeLabel(variant)}
                          </span>
                          <span className="mt-0.5 block text-xs text-stone-500">
                            {formatPrice(priceAfter(Number(variant.price), saleFor(variant)))}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Quantity</p>
                  <div className="inline-flex items-center rounded-xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="grid h-10 w-10 min-h-0! place-items-center rounded-l-xl text-stone-700 transition hover:bg-stone-50 disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold text-stone-900" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                      disabled={quantity >= MAX_QUANTITY}
                      aria-label="Increase quantity"
                      className="grid h-10 w-10 min-h-0! place-items-center rounded-r-xl text-stone-700 transition hover:bg-stone-50 disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total</p>
                  <p className="mt-2 text-lg font-bold text-stone-900">{formatPrice(price * quantity)}</p>
                </div>
              </div>

              {product.accords && product.accords.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Smells like</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.accords.slice(0, 6).map((accord) => (
                      <span key={accord} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">
                        {accord}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={productHref}
                onClick={close}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                See full details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Buy buttons: always in view */}
            <div className="shrink-0 border-t border-stone-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => (isWishlisted ? wishlist.removeFromWishlist?.(product.id) : wishlist.addToWishlist?.(product))}
                  aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                  aria-pressed={isWishlisted}
                  className={cn(
                    "grid h-12 w-12 min-h-0! shrink-0 place-items-center rounded-xl border transition active:scale-95",
                    isWishlisted ? "border-red-200 bg-red-50 text-red-600" : "border-stone-200 text-stone-700 hover:text-red-600"
                  )}
                >
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={busy !== null}
                  className={cn(
                    "flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed",
                    justAdded ? "bg-emerald-600" : "bg-emerald-700 hover:bg-emerald-800"
                  )}
                >
                  {justAdded ? <Check className="h-5 w-5 shrink-0" /> : <ShoppingCart className="h-5 w-5 shrink-0" />}
                  <span className="truncate">{justAdded ? "Added" : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={busy !== null}
                  className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 bg-linear-to-r from-orange-600 via-red-600 to-rose-600 px-3 text-sm font-bold text-white transition hover:from-orange-700 hover:via-red-700 hover:to-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Zap className="h-4 w-4 shrink-0 fill-current" />
                  <span className="truncate">Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
