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

/**
 * The size a product starts on, everywhere: product cards, quick view and the product page.
 * It is the size marked "default" in the admin; when none is marked, the second smallest
 * (the smallest when there is only one). One rule, so the price on a card is always the price
 * the product page opens with.
 */
export function pickStartingVariant<V extends Sized & { isDefault?: boolean }>(
  variants: readonly V[] | null | undefined
): V | null {
  const sorted = sortVariantsBySize(variants);
  return sorted.find((v) => v.isDefault === true) ?? sorted[1] ?? sorted[0] ?? null;
}

/**
 * The sizes offered as buttons: the first few by size, always including the starting size
 * (a default size further down the list must not be missing from its own page).
 */
export function offeredVariants<V extends Sized & { isDefault?: boolean }>(
  variants: readonly V[] | null | undefined,
  max = 4
): V[] {
  const sorted = sortVariantsBySize(variants);
  const shown = sorted.slice(0, max);
  const start = pickStartingVariant(sorted);
  if (start && !shown.includes(start)) shown[shown.length - 1] = start;
  return shown;
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
