import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // We use coerce to force string inputs into numbers
  price: z.coerce.number().min(0.01, "Price must be greater than 0"), 
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  imageUrls: z.array(z.string().url()).min(1, "At least one image is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;