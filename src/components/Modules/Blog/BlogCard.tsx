"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  slug?: string;
  createdAt: string;
}

const BlogCard = ({ title, content, imageUrl, slug, createdAt }: BlogCardProps) => {
  return (
    <Link href={`/blogs/${slug}`}>
      <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-orange-200 rounded-2xl overflow-hidden bg-white">
        <div className="relative w-full h-56">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold text-[#FB923C] line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
