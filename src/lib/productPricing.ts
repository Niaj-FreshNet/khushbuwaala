// Small pricing helpers shared by the product page, product cards and quick view.
import type { IDiscount } from "@/types/product.types";

type Sized = { size?: number | string | null; price?: number | null };
type Discounted = { discounts?: IDiscount[] | null };

/** "6", 6 and "6ml" all read as 6. A size that is not a number sorts last. */
export function numericSize(variant: Sized | null | undefined): number {
  const parsed = parseFloat(String(variant?.size ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : Infinity;
}

/** Smallest size first; equal sizes by price. Returns a new list. */
export function sortVariantsBySize<V extends Sized>(variants: readonly V[] | null | undefined): V[] {
  return [...(variants ?? [])].sort((a, b) => {
    const sizeA = numericSize(a);
    const sizeB = numericSize(b);
    if (sizeA !== sizeB) return sizeA - sizeB;
    return Number(a?.price ?? 0) - Number(b?.price ?? 0);
  });
}

/** A sale that applies by itself and is running now (coupon codes are never shown as sales). */
function isRunningSale(discount: IDiscount | null | undefined, now: Date): discount is IDiscount {
  if (!discount) return false;
  if (discount.code && String(discount.code).trim() !== "") return false;
  const started = !discount.startDate || new Date(discount.startDate) <= now;
  const notEnded = !discount.endDate || new Date(discount.endDate) >= now;
  return started && notEnded;
}

/** The running sale for a size: the size's own sale first, then the product's. */
export function activeAutoDiscount(
  product: Discounted | null | undefined,
  variant?: Discounted | null
): IDiscount | null {
  const now = new Date();
  return (
    (variant?.discounts ?? []).find((d) => isRunningSale(d, now)) ||
    (product?.discounts ?? []).find((d) => isRunningSale(d, now)) ||
    null
  );
}
