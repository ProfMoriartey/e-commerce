"use client";

import { useTransition } from "react";
import Image from "next/image";
import { removeCartItem } from "~/server/actions/cart";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

// Define the type based on your database query return
type CartItem = {
  cartId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
};

export function CartSheet({ items }: { items: CartItem[] }) {
  const [isPending, startTransition] = useTransition();

  const cartTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cartTotal / 100);

  function handleRemove(cartId: string) {
    startTransition(async () => {
      await removeCartItem(cartId);
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Cart ({items.length})</Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Shopping Cart</SheetTitle>
        </SheetHeader>

        <ScrollArea className="-mx-6 my-4 flex-1 px-6">
          <div className="space-y-6">
            {items.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                Your cart is empty.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="line-clamp-1 font-medium">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold">
                      ${(item.product.price / 100).toFixed(2)}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleRemove(item.cartId)}
                      className="h-7 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formattedTotal}</span>
          </div>
          <Button className="w-full" size="lg" disabled={items.length === 0}>
            Proceed to Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
