import { IProduct, IProductResponse, IProductVariant } from "@/types/product.types";

function formatDate(date: string | Date | undefined) {
  if (!date) return "";
  return date instanceof Date ? date.toISOString() : date;
}

export default function mapProductResponseToProduct(
  product: IProductResponse
): IProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    primaryImage: product.primaryImage,
    otherImages: product.otherImages || [],
    videoUrl: product.videoUrl,
    tags: product.tags || [],
    
    origin: product.origin,
    brand: product.brand,
    gender: product.gender,
    perfumeNotes: product.perfumeNotes,
    accords: product.accords || [],
    performance: product.performance,
    longevity: product.longevity,
    projection: product.projection,
    sillage: product.sillage,
    bestFor: product.bestFor || [],
    
    categoryId: product.categoryId,
    published: product.published,
    
    stock: product.stock || 0,
    variants: product.variants.map<IProductVariant>(v => ({
      id: v.id,
      sku: v.sku,
      unit: v.unit,
      size: v.size,
      price: v.price,
      stock: v.stock,
      createdAt: formatDate(v.createdAt),
      updatedAt: formatDate(v.updatedAt),
    })),
    
    discounts: [], // map if you have product-level discounts
    minPrice: product.minPrice,
    maxPrice: product.maxPrice,
    totalStock: product.totalStock,
    inStock: product.inStock,
    
    createdAt: formatDate(product.createdAt),
    updatedAt: formatDate(product.updatedAt),
  };
}
