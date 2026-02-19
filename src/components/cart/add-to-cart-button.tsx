"use client";

import { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import { addToCart } from "~/server/actions/cart";
import { toast } from "sonner";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleAddToCart() {
    startTransition(async () => {
      try {
        await addToCart(productId);
        toast.success("Added to cart");
      } catch (error) {
        toast.error("Please sign in to add items");
      }
    });
  }

  return (
    <Button
      size="lg"
      className="w-1/2 sm:w-auto"
      disabled={disabled || isPending}
      onClick={handleAddToCart}
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
