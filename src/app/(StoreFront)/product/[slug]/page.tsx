import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/Functions/ServerFn";
import ProductDetailPage from "./_components/ProductDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params; // ✅ unwrap
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return <ProductDetailPage product={product} />;
}

export const revalidate = 3600;
