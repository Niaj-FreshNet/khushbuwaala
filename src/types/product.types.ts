
// Base Product Variant Interface (aligned with schema)

export interface IDiscount {
  id: string;
  productId: string;
  code?: string;
  type: "percentage" | "fixed";
  value: number;
  maxUsage?: number;
  startDate?: string;
  endDate?: string;
  variantId?: string; // null means product-level discount
  createdAt: string;
  updatedAt: string;
}

export interface IProductVariant {
  id?: string;
  sku: string;
  unit: string;
  size: number;
  price: number;
  stock?: number;
  discounts?: IDiscount[]; // variant-level discounts
  /** The size the shop shows first (set in the admin's product editor). */
  isDefault?: boolean;
  /** Pictures of this size (its own bottle). */
  images?: string[];

  createdAt?: string;
  updatedAt?: string;
}

// Product Creation Interface
export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  primaryImage: string;
  otherImages?: string[];
  videoUrl?: string;
  tags: string[];

  // Perfume specifications
  origin?: string;
  brand?: string;
  gender?: string;
  perfumeNotes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  accords: string[];
  performance?: string;
  longevity?: string;
  projection?: string;
  sillage?: string;
  bestFor: string[];

  categoryId: string;
  /** Readable category, for breadcrumbs and reports (the id alone means nothing there). */
  category?: {
    categoryName: string;
    imageUrl: string;
  };
  published: boolean;

  materialIds: string[];
  fragranceIds: string[];
  materials?: {
    id: string;
    name: string;
  }[];
  fragrances?: {
    id: string;
    name: string;
  }[];

  reviews: IReview[];
  averageRating: number;
  reviewCount: number;

  supplier: string;
  stock?: number; // float at product-level
  variants: IProductVariant[];
  discounts?: IDiscount[]; // product-level discounts
  discount?: number;

  // Computed fields
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  inStock: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  isPublished: boolean;
  productId: string;
  userId?: string;
  user?: {
    name: string;
    imageUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Response Interfaces
export interface IProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  primaryImage: string;
  otherImages: string[];
  videoUrl?: string;
  tags: string[];
  salesCount: number;
  published: boolean;

  // Perfume specifications
  origin?: string;
  brand?: string;
  gender?: 'UNISEX' | 'MALE' | 'FEMALE';
  perfumeNotes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  accords: string[];
  performance?: string;
  longevity?: string;
  projection?: string;
  sillage?: string;
  bestFor: string[];

  categoryId: string;
  category?: {
    categoryName: string;
    imageUrl: string;
  };

  materialIds: string[];
  fragranceIds: string[];
  materials?: {
    id: string;
    name: string;
  }[];
  fragrances?: {
    id: string;
    name: string;
  }[];

  reviews: IReview[];
  averageRating: number;
  reviewCount: number;

  supplier: string;
  stock?: number;
  variants: IProductVariantResponse[];
  discounts?: IDiscount[];
  price?: number;

  // Computed fields
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  inStock: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface IProductVariantResponse {
  id: string;
  sku: string;
  unit: string;
  size: number;
  price: number;
  stock?: number;
  discounts?: IDiscount[];
  isDefault?: boolean;
  images?: string[];
  productId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Product cards ────────────────────────────────────────────────────────────────────────────
// A sale as product lists send it: one object per product (the product page sends `discounts`).
export type ListDiscount = {
  type?: string;
  value?: number;
  /** Some lists send the final price instead of a rule. */
  price?: number;
  code?: string | null;
  startDate?: string | Date;
  endDate?: string | Date;
};

// What a product card needs. Shop search results, home page rows, similar scents and the
// wishlist each send a slightly different product; all of them fit this.
export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  primaryImage: string;
  otherImages?: string[];
  brand?: string | null;
  category?: { label?: string; categoryName?: string } | null;
  minPrice?: number;
  price?: number;
  variants?: {
    id?: string;
    sku?: string;
    size?: number;
    unit?: string;
    price: number;
    discounts?: IDiscount[];
    isDefault?: boolean;
    images?: string[];
  }[];
  discount?: ListDiscount | null;
  discounts?: IDiscount[];
  families?: string[];
  accords?: string[];
  fragrances?: { id: string; name: string }[];
};
