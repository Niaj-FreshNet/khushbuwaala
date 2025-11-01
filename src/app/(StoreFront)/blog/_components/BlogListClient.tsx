'use client';

import { useGetAllBlogsQuery } from "@/redux/store/api/blog/blogApi";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import BlogCard from "@/components/Modules/Blog/BlogCard";

interface BlogListClientProps {
  initialData?: any;
}

const BlogListClient = ({ initialData }: BlogListClientProps) => {
  const { data, isLoading, isError } = useGetAllBlogsQuery({ page: 1, limit: 9 });

  // Use RTK Query data if available, otherwise fall back to initialData
  const blogData = data || initialData;

  if (isLoading && !initialData) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if ((isError && !initialData) || !blogData?.data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <AlertCircle className="w-10 h-10 mb-2 text-orange-400" />
        <p>Failed to load blogs. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 mt-4">
      <h1 className="text-3xl font-bold text-black mb-10 text-center">
        Our Latest Blogs
      </h1>

      {blogData?.data?.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData?.data?.data.map((blog: any) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center text-gray-500">
          No blogs published yet.
        </Card>
      )}
    </section>
  );
};

export default BlogListClient;