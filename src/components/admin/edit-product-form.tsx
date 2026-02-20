"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductFormValues,
} from "~/lib/validators/product";
import { updateProduct } from "~/server/actions/products";
import { UploadButton, UploadDropzone } from "~/utils/uploadthing";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useTransition } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { X } from "lucide-react";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrls: string[];
};

export function EditProductForm({ product }: { product: ProductProps }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price / 100,
      stock: product.stock,
      category: product.category,
      imageUrls: product.imageUrls || [],
    },
  });

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      try {
        await updateProduct(product.id, values);
        toast.success("Product updated successfully");
      } catch (error) {
        toast.error("Failed to update product");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => {
            const currentImages = Array.isArray(field.value) ? field.value : [];

            return (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {currentImages.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {currentImages.map((url, index) => (
                          <div
                            key={url}
                            className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200"
                          >
                            <Image
                              src={url}
                              alt={`Product preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => {
                                const newUrls = [...currentImages];
                                newUrls.splice(index, 1);
                                field.onChange(newUrls);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentImages.length < 5 && (
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          const newUrls = res.map((file) => file.url);
                          field.onChange([...currentImages, ...newUrls]);
                          toast.success("Images uploaded");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed ${error.message}`);
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving changes..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}
