import { notFound } from 'next/navigation';
import { useGetBlogQuery } from '@/redux/api/blog/blogApi';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateMetadata as generateMetadataUtil } from 'next';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
    const { data } = await useGetBlogQuery(params.slug); // Note: This is a client-side hook, adjust for server-side if needed
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
}

const BlogDetail = ({ params }: Props) => {
    const { data, isLoading, error } = useGetBlogQuery(params.slug);

    if (isLoading) return <div className="p-6 text-center">Loading...</div>;
    if (error || !data?.blog) return notFound();

    const { blog, relatedBlogs } = data;

    return (
        <div className="p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <Card className="border-[#FB923C]">
                    <CardHeader>
                        <CardTitle className="text-[#FB923C]">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Image
                            src={blog.imageUrl || '/placeholder.svg'}
                            alt={blog.title}
                            width={800}
                            height={400}
                            className="object-cover rounded mb-4"
                        />
                        <div className="prose" dangerouslySetInnerHTML={{ __html: blog.content }} />
                        <p className="text-sm text-gray-600 mt-4">
                            Published by {blog.user.name} on {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
                {relatedBlogs.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-[#FB923C] mb-4">Related Blogs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {relatedBlogs.map((related) => (
                                <Card key={related.id} className="border-[#FB923C]">
                                    <CardHeader>
                                        <CardTitle className="text-sm">{related.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Image
                                            src={related.imageUrl || '/placeholder.svg'}
                                            alt={related.title}
                                            width={200}
                                            height={100}
                                            className="object-cover rounded mb-2"
                                        />
                                        <a href={`/blogs/${related.slug}`} className="text-[#FB923C] hover:underline">
                                            Read More
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogDetail;