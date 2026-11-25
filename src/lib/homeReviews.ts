// The customer reviews shown on the home page. The backend decides which ones (published 5-star
// reviews; the owner can pin, hide or switch the section off in the admin's Reviews page).
import { apiFetch } from "@/lib/apiFetch";

export type HomeReview = {
  id: string;
  rating: number;
  name: string;
  avatar: string | null;
  comment: string;
  imageUrl: string | null;
  createdAt: string;
  product: { name: string; slug: string; primaryImage: string } | null;
};

/** Empty when the section is switched off, too few reviews qualify, or the API cannot be reached. */
export async function fetchHomeReviews(): Promise<HomeReview[]> {
  try {
    const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/review/home`, {
      next: { revalidate: 60, tags: ["home-reviews"] },
    });
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body?.data) ? body.data : [];
  } catch {
    return [];
  }
}
