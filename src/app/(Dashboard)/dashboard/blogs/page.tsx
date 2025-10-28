'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash, X, Upload } from 'lucide-react';
import JoditEditor from 'jodit-react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  useGetAdminBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '@/redux/store/api/blog/blogApi';
import Image from 'next/image';

interface BlogData {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  isPublish: boolean;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

const formSchema = z.object({
  title: z.string().min(1, 'Blog title is required').max(70, 'Title must be 70 characters or less'),
  metaTitle: z.string().min(1, 'SEO title is required').max(70, 'SEO title must be 70 characters or less'),
  metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Meta description must be 160 characters or less'),
  keywords: z.string().optional(),
  isPublish: z.boolean(),
});

interface FormValues {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  isPublish: boolean;
}

const joditConfig = {
  readonly: false,
  height: 300,
  toolbar: true,
  spellcheck: true,
  language: 'en',
  toolbarButtonSize: 'small',
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  buttons: [
    'font',
    'fontsize',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'superscript',
    'subscript',
    '|',
    'align',
    '|',
    'ul',
    'ol',
    '|',
    'outdent',
    'indent',
    '|',
    'link',
    'image',
    '|',
    'hr',
    'table',
    '|',
    'undo',
    'redo',
  ],
  style: {
    font: '14px Arial, sans-serif',
  },
};

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null);
  const [blogContent, setBlogContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const { data, isLoading } = useGetAdminBlogsQuery({ page: 1, limit: 10 });
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { isPublish: false },
  });

  const isPublishValue = useWatch({ control, name: 'isPublish' });

  const allBlogs: BlogData[] = useMemo(() => data?.data?.data || [], [data]);
  const meta = data?.data?.meta;

  const filteredBlogs = useMemo(
    () => allBlogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [allBlogs, searchTerm]
  );

  const handleEdit = (blog: BlogData) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
    setBlogContent(blog.content);
    setImagePreview(blog.imageUrl);
    setValue('title', blog.title);
    setValue('metaTitle', blog.metaTitle || blog.title);
    setValue('metaDescription', blog.metaDescription || '');
    setValue('keywords', blog.keywords || '');
    setValue('isPublish', blog.isPublish);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?');
    if (confirmed) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully');
      } catch {
        toast.error('Failed to delete blog');
      }
    }
  };

  const handlePublishToggle = async (checked: boolean, blog: BlogData) => {
    try {
      const formData = new FormData();
      formData.append('isPublish', checked.toString());
      if (blog.imageUrl) formData.append('imageUrl', blog.imageUrl);
      if (blog.metaTitle) formData.append('metaTitle', blog.metaTitle);
      if (blog.metaDescription) formData.append('metaDescription', blog.metaDescription);
      if (blog.keywords) formData.append('keywords', blog.keywords);
      formData.append('title', blog.title);
      formData.append('content', blog.content);
      await updateBlog({ id: blog.id, data: formData }).unwrap();
      toast.success('Blog status updated successfully');
    } catch {
      toast.error('Failed to update blog status');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt25M = file.size / 1024 / 1024 < 25;
      if (!isJpgOrPng) {
        toast.error('You can only upload JPG/PNG files!');
        return;
      }
      if (!isLt25M) {
        toast.error('Image must be smaller than 25MB!');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (data: FormValues) => {
    if (!editingBlog || !blogContent) {
      toast.error('Blog content is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('metaTitle', data.metaTitle);
      formData.append('metaDescription', data.metaDescription);
      if (data.keywords) formData.append('keywords', data.keywords);
      formData.append('content', blogContent);
      formData.append('isPublish', data.isPublish.toString());
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (editingBlog.imageUrl) {
        formData.append('imageUrl', editingBlog.imageUrl);
      }

      await updateBlog({ id: editingBlog.id, data: formData }).unwrap();
      toast.success('Blog updated successfully');
      setIsEditModalOpen(false);
      setEditingBlog(null);
      setBlogContent('');
      setImageFile(null);
      setImagePreview(null);
      reset();
    } catch {
      toast.error('Failed to update blog');
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Search & Add */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <Input
            placeholder="Search Blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 border-[#FB923C] focus:ring-[#FB923C]"
          />
          <Button
            className="bg-[#FB923C] hover:bg-[#ff8a29] text-white"
            onClick={() => router.push('/dashboard/blogs/add')}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Blog
          </Button>
        </div>

        {/* Blog Table */}
        <Table className="border-[#FB923C]">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Publish</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Image
                    src={blog.imageUrl || '/placeholder.svg'}
                    alt={blog.title}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={blog.isPublish}
                    onCheckedChange={(checked) => handlePublishToggle(checked, blog)}
                    className="data-[state=checked]:bg-[#4CD964]"
                  />
                </TableCell>
                <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredBlogs.length} of {meta.total} blogs
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={meta.page === 1}
                onClick={() => router.push(`/dashboard/blogs?page=${meta.page - 1}`)}
                className="border-[#FB923C] text-[#FB923C]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={meta.page >= meta.totalPage}
                onClick={() => router.push(`/dashboard/blogs?page=${meta.page + 1}`)}
                className="border-[#FB923C] text-[#FB923C]"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Edit Blog Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-[#FB923C]">Edit Blog</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Blog Title</Label>
                <Input id="title" placeholder="Enter blog title" {...register('title')} className="border-[#FB923C]" />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* SEO */}
              <div>
                <Label htmlFor="metaTitle">SEO Title</Label>
                <Input id="metaTitle" {...register('metaTitle')} className="border-[#FB923C]" />
                {errors.metaTitle && <p className="text-red-500 text-sm mt-1">{errors.metaTitle.message}</p>}
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" {...register('metaDescription')} className="border-[#FB923C]" />
                {errors.metaDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.metaDescription.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input id="keywords" {...register('keywords')} className="border-[#FB923C]" />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Blog Image</Label>
                <div className="border-2 border-dashed border-[#FB923C] rounded-lg p-4 text-center">
                  <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="hidden" id="image-upload-edit" />
                  <Label htmlFor="image-upload-edit" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-[#FB923C] mb-2" />
                      <p className="text-sm text-gray-600">Drop file or browse (JPEG/PNG, max 25MB)</p>
                    </div>
                  </Label>
                </div>
                {imagePreview && (
                  <div className="mt-4 relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 bg-white rounded-full"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(editingBlog?.imageUrl || null);
                      }}
                    >
                      <X className="w-4 h-4 text-[#FB923C]" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div>
                <Label>Blog Content</Label>
                <div className="border border-[#FB923C] rounded-lg overflow-hidden">
                  <JoditEditor value={blogContent} config={joditConfig} onBlur={(newContent) => setBlogContent(newContent)} />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-4">
                <Label htmlFor="isPublish">Published</Label>
                <Switch
                  id="isPublish"
                  checked={!!isPublishValue}
                  onCheckedChange={(checked) => setValue('isPublish', checked)}
                  className="data-[state=checked]:bg-[#4CD964]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#FB923C] text-[#FB923C]"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingBlog(null);
                    setBlogContent('');
                    setImageFile(null);
                    setImagePreview(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="bg-[#FB923C] hover:bg-[#ff8a29] text-white">
                  {isUpdating ? 'Updating...' : 'Update Blog'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BlogList;
