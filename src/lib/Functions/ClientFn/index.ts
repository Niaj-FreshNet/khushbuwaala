import { IDiscount, IProduct, IProductResponse, IProductVariant } from "@/types/product.types";
import { htmlToText } from "@/lib/text";

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
    description: htmlToText(product.description),
    primaryImage: product.primaryImage,
    otherImages: product.otherImages || [],
    videoUrl: product.videoUrl,
    tags: product.tags || [],
    
    origin: product.origin,
    fragrances: product.fragrances || [],
    materials: product.materials || [],
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
    category: product.category,
    published: product.published,

    materialIds: product.materialIds || [],
    fragranceIds: product.fragranceIds || [],
    reviews: product.reviews || [],
    averageRating: product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    
    supplier: product.supplier,
    stock: product.stock || 0,
    variants: product.variants?.map<IProductVariant>(v => ({
      id: v.id,
      discounts:
          v.discounts?.map<IDiscount>((d) => ({
            id: d.id,
            productId: d.productId,
            variantId: d.variantId,
            code: d.code,
            type: d.type,
            value: d.value,
            maxUsage: d.maxUsage,
            startDate: formatDate(d.startDate),
            endDate: formatDate(d.endDate),
            createdAt: formatDate(d.createdAt),
            updatedAt: formatDate(d.updatedAt),
          })) || [],
      sku: v.sku,
      unit: v.unit,
      size: v.size,
      price: v.price,
      stock: v.stock,
      createdAt: formatDate(v.createdAt),
      updatedAt: formatDate(v.updatedAt),
    })),
    
    discounts:
          product.discounts?.map<IDiscount>((d) => ({
            id: d.id,
            productId: d.productId,
            variantId: d.variantId,
            code: d.code,
            type: d.type,
            value: d.value,
            maxUsage: d.maxUsage,
            startDate: formatDate(d.startDate),
            endDate: formatDate(d.endDate),
            createdAt: formatDate(d.createdAt),
            updatedAt: formatDate(d.updatedAt),
          })) || [], // map if you have product-level discounts
    minPrice: product.minPrice,
    maxPrice: product.maxPrice,
    totalStock: product.totalStock,
    inStock: product.inStock,
    
    createdAt: formatDate(product.createdAt),
    updatedAt: formatDate(product.updatedAt),
  };
}
