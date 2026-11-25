// Shapes of what the backend sends for orders and for the discount check.
// Most fields are optional on purpose: the same order is read from several routes (place order,
// my orders, tracking, invoice) and each sends a different subset.

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type OrderAddress = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  district?: string | null;
  thana?: string | null;
};

export type OrderLine = {
  id: string;
  productId?: string;
  variantId?: string | null;
  name?: string;
  size?: number | string | null;
  unit?: string | null;
  quantity: number;
  /** What the customer paid for one unit. */
  price: number;
  /** The regular price of one unit, when a sale applied. */
  originalPrice?: number | null;
  discount?: number | null;
  product?: {
    id?: string;
    name?: string;
    slug?: string;
    primaryImage?: string | null;
  } | null;
  variant?: {
    id?: string;
    sku?: string;
    size?: number | string | null;
    unit?: string | null;
    price?: number;
  } | null;
};

export type Order = {
  id: string;
  invoice?: string;
  status: string;
  isPaid?: boolean;
  method?: string | null;
  amount: number;
  shippingCost?: number;
  estimatedTaxes?: number;
  discountAmount?: number;
  coupon?: string | null;
  orderSource?: string;
  orderTime?: string;
  createdAt?: string;
  updatedAt?: string;
  additionalNotes?: string | null;
  customerId?: string | null;
  customer?: { id?: string; name?: string; imageUrl?: string } | null;
  customerInfo?: OrderAddress | null;
  shipping?: OrderAddress | null;
  shippingAddress?: OrderAddress | null;
  billing?: OrderAddress | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  /** Sent only to the person who placed the order; needed to start an online payment. */
  payToken?: string;
  /** Tracking only: the name and address were left out (shown after the phone number is checked). */
  detailsHidden?: boolean;
  /** Tracking only: the search matched by phone/email, so the invoice number is hidden. */
  needsInvoice?: boolean;
  orderItems?: OrderLine[];
};

/** `/order/my-orders`: one page of the signed-in customer's orders plus totals. */
export type MyOrders = {
  meta?: { page?: number; limit?: number; total?: number; totalPage?: number };
  totalOrders?: number;
  totalAmount?: number;
  data: Order[];
};

// ── Discount check (`/discount/apply`) ───────────────────────────────────────────────────────

export type DiscountCheckItem = {
  productId: string;
  variantId?: string;
  price: number;
  qty: number;
};

export type AppliedDiscount = {
  code?: string | null;
  type?: "percentage" | "fixed";
  value?: number;
};

export type DiscountCheckLine = {
  productId?: string;
  variantId?: string | null;
  price?: number;
  originalPrice?: number;
  discountedPrice?: number;
  qty?: number;
  appliedDiscounts?: AppliedDiscount[];
  product?: { id?: string; _id?: string } | null;
  variant?: { id?: string; _id?: string } | null;
};

export type DiscountCheck = {
  items?: DiscountCheckLine[];
  /** All discounts together (sale + coupon). */
  discountAmount?: number;
  /** The coupon's part only. */
  couponDiscountAmount?: number | null;
  /** Older answers: a discount on the whole order rather than on single lines. */
  orderDiscountAmount?: number;
  orderDiscount?: AppliedDiscount | null;
  subtotal?: number;
  total?: number;
};
