'use client';

import { useGetBlogQuery } from '@/redux/store/api/blog/blogApi';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

interface BlogDetailClientProps {
    slug: string;
    initialData?: any;
}

const BlogDetailClient = ({ slug, initialData }: BlogDetailClientProps) => {
    const { data, isLoading, error } = useGetBlogQuery(slug);

    // Use RTK Query data if available, otherwise fall back to initialData
    const blogData = data || initialData;

    if (isLoading) return <div className="p-6 text-center">Loading...</div>;
    if (error || !blogData?.blog) return notFound();

    const { blog, relatedBlogs } = blogData;

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
                {relatedBlogs && relatedBlogs.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-[#FB923C] mb-4">Related Blogs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {relatedBlogs.map((related: any) => (
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
                                        {/* FIX: Use template literal correctly */}
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

export default BlogDetailClient;