import { getProductBySlug } from "@/lib/Functions";
import HydrateProduct from "./_components/HydrateProduct";


export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) return null;

  return <HydrateProduct initialData={product} slug={params.slug} />;
}