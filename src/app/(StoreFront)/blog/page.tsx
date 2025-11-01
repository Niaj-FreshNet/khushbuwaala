import BlogListClient from './_components/BlogListClient';

export const metadata = {
  title: 'Our Latest Blogs | Khushbuwaala',
  description: 'Read our latest blog posts and articles about perfumes and fragrances',
};

// Server-side data fetching
async function getBlogsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/get-all-blogs?page=1&limit=9`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return null;
  }
}

const BlogPage = async () => {
  const initialData = await getBlogsData();

  return <BlogListClient initialData={initialData} />;
};

export default BlogPage;