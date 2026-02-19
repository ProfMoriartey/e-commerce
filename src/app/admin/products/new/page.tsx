"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductFormValues,
} from "~/lib/validators/product"; // Adjust path
import { createProduct } from "~/server/actions/products";
import { UploadButton } from "~/utils/uploadthing"; // Your Uploadthing component
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
import { toast } from "sonner"; // Or your preferred toast library
import Image from "next/image";

export default function AddProductPage() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
    },
  });

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      try {
        await createProduct(values);
        toast.success("Product created!");
      } catch (error) {
        toast.error("Failed to create product");
        console.error(error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Winter Jacket" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detailed description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
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

            {/* Stock */}
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

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Clothing, Electronics..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    {field.value ? (
                      <div className="relative mx-auto aspect-video w-full max-w-xs overflow-hidden rounded-md">
                        <Image
                          src={field.value}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => field.onChange("")}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res[0]?.url);
                          toast.success("Image uploaded");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`ERROR! ${error.message}`);
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
