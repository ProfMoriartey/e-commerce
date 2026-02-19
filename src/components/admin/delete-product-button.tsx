"use client";

import { useTransition } from "react";
import { deleteProduct } from "~/server/actions/products";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("Product deleted");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    });
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
      className="mt-6 w-full"
    >
      {isPending ? "Deleting..." : "Delete Product"}
    </Button>
  );
}
