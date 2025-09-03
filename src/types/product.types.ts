
// Base Product Variant Interface (aligned with schema)

export interface IDiscount {
  id: string;
  code?: string;
  type: "percentage" | "fixed";
  value: number;
  maxUsage?: number;
  startDate?: string;
  endDate?: string;
  variantId?: string; // null means product-level discount
}

export interface IProductVariant {
  id: string;
  sku: string;
  unit: string;
  size: number;
  price: number;
  stock?: number;
  discounts?: IDiscount[]; // variant-level discounts

  createdAt: string;
  updatedAt: string;
}

// Product Creation Interface
export interface IProduct {
  id: string;
  name: string;
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

  stock: number; // float at product-level
  variants: IProductVariant[];
  discounts?: IDiscount[]; // product-level discounts
  
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
  category?: {
    categoryName: string;
    imageUrl: string;
  };
  
  variants: IProductVariantResponse[];
  
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
  stock: number;
  productId: string;
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
