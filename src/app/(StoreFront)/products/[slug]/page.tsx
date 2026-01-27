import { getProductBySlug } from "@/lib/Functions/ServerFn";
import HydrateProduct from "./_components/HydrateProduct";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // ✅ Await params
  const { slug } = await params;

  // Fetch product data server-side
  const product = await getProductBySlug(slug);

  if (!product) return null;

  return <HydrateProduct initialData={product} slug={slug} />;
}
