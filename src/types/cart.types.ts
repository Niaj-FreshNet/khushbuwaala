// What the cart keeps about a product. Product lists, the product page and quick view each have
// a slightly different product object; the cart only needs these fields from any of them.

export type CartVariant = {
  id?: string;
  sku?: string;
  size?: number | string;
  unit?: string;
  price: number;
};

export type CartProduct = {
  id: string;
  name: string;
  slug?: string;
  primaryImage?: string;
  brand?: string | null;
  category?: string | { label?: string; categoryName?: string } | null;
  minPrice?: number;
  price?: number;
  variants?: CartVariant[];
};

export interface CartItem {
  product: CartProduct;
  quantity: number;
  /** The chosen size as shown to the customer, e.g. "6 ml". */
  selectedSize: string;
  /** The price of one unit that the customer was shown (sale already taken off). */
  selectedPrice: number;
  /** The id of this line's copy on the server, once it has been saved there. */
  cartItemId?: string;
}

/** True when a product object has what the cart needs (an id and a name). */
export function isCartProduct<T extends object>(product: T | null | undefined): product is T & CartProduct {
  if (!product) return false;
  const p = product as { id?: unknown; name?: unknown };
  return typeof p.id === "string" && p.id !== "" && typeof p.name === "string";
}

/** The size a cart line was added with, found again in the product's sizes. */
export function findCartVariant(item: Pick<CartItem, "product" | "selectedSize">): CartVariant | undefined {
  const [sizeValue, sizeUnit] = String(item?.selectedSize || "").split(" ");
  return item?.product?.variants?.find(
    (v) =>
      Number(v?.size) === Number(sizeValue) &&
      String(v?.unit || "").toLowerCase() === String(sizeUnit || "").toLowerCase()
  );
}
