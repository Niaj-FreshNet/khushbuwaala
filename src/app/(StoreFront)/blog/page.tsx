import { Metadata } from "next";
import BlogListClient from "./_components/BlogListClient";
import { apiFetch } from "@/lib/apiFetch";

export const dynamic = "force-dynamic";

// With no published articles the page is an empty shell: keep it out of search engines until there is one.
export async function generateMetadata(): Promise<Metadata> {
  const data = await getBlogsData();
  const hasPosts = Array.isArray(data?.data) && data.data.length > 0;
  return {
    title: "Fragrance Journal",
    description: "Notes from Khushbuwaala on attars, oud and choosing a perfume.",
    alternates: { canonical: "https://khushbuwaala.com/blog" },
    robots: hasPosts ? { index: true, follow: true } : { index: false, follow: true },
  };
}

async function getBlogsData() {
  try {
    const res = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/get-all-blogs?page=1&limit=9`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null; // Access json.data from standard sendResponse
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
}

export default async function BlogPage() {
  const initialData = await getBlogsData();

  return (
    <main className="min-h-screen bg-neutral-50/60 pb-16">
      {/* Blog List View */}
      <BlogListClient initialData={initialData} />
    </main>
  );
}