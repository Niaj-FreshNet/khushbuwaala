import z from "zod";

export const categorySchema = z.object({
    categoryName: z.string().min(1, 'Category name is required'),
    sizes: z.array(z.string().min(1)).min(1, 'At least one size is required'),
    unit: z.string(),
    // specification: z.enum(['male', 'female', 'unisex'], { message: 'Please select a specification' }),
    published: z.boolean(),
});