"use client";

import { useTransition } from "react";
import { updateProduct } from "~/server/actions/products";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

export function EditProductForm({ product }: { product: ProductProps }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateProduct(product.id, formData);
        toast.success("Product updated");
      } catch (error) {
        toast.error("Failed to update product");
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" defaultValue={product.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product.description}
          required
          rows={5}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price in Dollars</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={(product.price / 100).toFixed(2)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product.stock}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          defaultValue={product.category}
          required
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving changes..." : "Save Product"}
      </Button>
    </form>
  );
}
