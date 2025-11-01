import { notFound } from 'next/navigation';
import BlogDetailClient from '../_components/BlogDetailClient';

interface Props {
    params: { slug: string };
}

// Server-side data fetching for metadata
export async function generateMetadata({ params }: Props) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/get-blog/${params.slug}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return {
                title: 'Blog Not Found',
                description: 'The requested blog could not be found.',
            };
        }

        const data = await response.json();
        const blog = data?.blog;

        if (!blog) {
            return {
                title: 'Blog Not Found',
                description: 'The requested blog could not be found.',
            };
        }

        return {
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.content.slice(0, 160),
            keywords: blog.keywords?.split(','),
            openGraph: {
                title: blog.metaTitle || blog.title,
                description: blog.metaDescription || blog.content.slice(0, 160),
                images: [{ url: blog.imageUrl }],
                url: `/blogs/${blog.slug}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: blog.metaTitle || blog.title,
                description: blog.metaDescription || blog.content.slice(0, 160),
                images: [blog.imageUrl],
            },
        };
    } catch (error) {
        return {
            title: 'Blog Not Found',
            description: 'The requested blog could not be found.',
        };
    }
}

// Server-side data fetching for the page
async function getBlogData(slug: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/get-blog/${slug}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        return null;
    }
}

const BlogDetail = async ({ params }: Props) => {
    const data = await getBlogData(params.slug);

    if (!data?.blog) {
        notFound();
    }

    // Pass initial data to client component for SSR
    return <BlogDetailClient slug={params.slug} initialData={data} />;
};

export default BlogDetail;