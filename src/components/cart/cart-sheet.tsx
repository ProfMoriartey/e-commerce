"use client";

import { useTransition } from "react";
import Image from "next/image";
import { removeCartItem, updateCartItemQuantity } from "~/server/actions/cart";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import Link from "next/link";

type CartItem = {
  cartId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
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

  function handleQuantityChange(
    cartId: string,
    newQuantity: number,
    stock: number,
  ) {
    if (newQuantity > stock) return;

    startTransition(async () => {
      await updateCartItemQuantity(cartId, newQuantity);
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
                Your cart is empty
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

                    <div className="mt-2 flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        disabled={isPending}
                        onClick={() =>
                          handleQuantityChange(
                            item.cartId,
                            item.quantity - 1,
                            item.product.stock,
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-4 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        disabled={
                          isPending || item.quantity >= item.product.stock
                        }
                        onClick={() =>
                          handleQuantityChange(
                            item.cartId,
                            item.quantity + 1,
                            item.product.stock,
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold">
                      ${((item.product.price * item.quantity) / 100).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleRemove(item.cartId)}
                      className="h-7 text-xs text-red-500 hover:text-red-700"
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
          <Link href={"/checkout"}>
            <Button className="w-full" size="lg" disabled={items.length === 0}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
