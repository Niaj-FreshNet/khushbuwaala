
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
}

export interface StockLog {
  id: string;
  productId: string;
  change: number;
  reason: string;
  createdAt: string;
  product: { name: string };
}

export interface IProductVariant {
  id?: string;
  sku: string;
  unit: string;
  size: number;
  price: number;
  stock?: number;
  discounts?: IDiscount[]; // variant-level discounts

  createdAt?: string;
  updatedAt?: string;
}

export interface VariantForForm extends Omit<IProductVariant, "size"> {
  size: string; // force size to be string here
  price: number;
  stock?: number;
  unit: string;
  sku: string;
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
  published: boolean;
  
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

// Product Update Interface
export interface IUpdateProduct {
  name?: string;
  description?: string;
  primaryImage?: string;
  otherImages?: string[];
  videoUrl?: string;
  tags?: string[];

  // Perfume specifications
  origin?: string;
  brand?: string;
  gender?: string;
  perfumeNotes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  accords?: string[];
  performance?: string;
  longevity?: string;
  projection?: string;
  sillage?: string;
  bestFor?: string[];

  categoryId?: string;
  published?: boolean;

  // Image handling
  imagesToKeep?: string[];
  newImages?: string[];

  stock?: number;
  variants?: IProductVariant[];
}

// Query Interfaces
export interface IProductQuery {
  search?: string;
  categories: { id: string; name: string }[]; // update here
  brand?: string;
  gender?: string;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  accords?: string;
  bestFor?: string;
  stock?: 'in' | 'out';
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'popularity';
  page?: number;
  limit?: number;
  [key: string]: unknown;
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

  reviews: IReview[];
  averageRating: number;
  reviewCount: number;

  supplier: string;
  stock?: number;
  variants: IProductVariantResponse[];
  discounts?: IDiscount[];

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
  productId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Interfaces
export interface IProductAnalytics {
  totalProducts: number;
  publishedProducts: number;
  unpublishedProducts: number;
  totalVariants: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  averagePrice: number;
  topCategories: Array<{
    categoryName: string;
    productCount: number;
    percentage: number;
  }>;
  topBrands: Array<{
    brand: string;
    productCount: number;
    percentage: number;
  }>;
}

// Stock Update Interface
export interface IStockUpdate {
  productId: string;
  variantId: string;
  newStock: number;
  reason?: string;
}

// Search Result Interface
export interface IProductSearchResult {
  data: IProductResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    brands: string[];
    categories: { id: string; name: string }[];
    priceRange: {
      min: number;
      max: number;
    };
    origins: string[];
    accords: string[];
  };
}

// Trending Product Interface
export interface ITrendingProduct extends IProductResponse {
  totalSold: number;
  trendingScore: number;
}

// Related Products Interface
export interface IRelatedProductsResponse {
  sameBrand: IProductResponse[];
  sameCategory: IProductResponse[];
  similarAccords: IProductResponse[];
  recentlyViewed?: IProductResponse[];
}

export interface LowStockProduct {
  id: string;
  name: string;
  category: string;
  stock: number;
  variants: Array<{
    id: string;
    sku: string;
    size: number;
    // unit: Unit;
    unit: string;
    price: number;
  }>;
}
