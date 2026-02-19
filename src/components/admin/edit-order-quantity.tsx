"use client";

import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import { updateOrderItemQuantity } from "~/server/actions/admin-orders";
import { toast } from "sonner";

type Props = {
  orderId: string;
  itemId: string;
  currentQuantity: number;
};

export function EditOrderQuantity({ orderId, itemId, currentQuantity }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleUpdate(newQty: number) {
    startTransition(async () => {
      try {
        await updateOrderItemQuantity(orderId, itemId, newQty);
        toast.success("Quantity updated");
      } catch (error) {
        toast.error("Failed to update quantity");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        disabled={isPending || currentQuantity <= 1}
        onClick={() => handleUpdate(currentQuantity - 1)}
      >
        -
      </Button>
      <span className="w-4 text-center text-sm">{currentQuantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        disabled={isPending}
        onClick={() => handleUpdate(currentQuantity + 1)}
      >
        +
      </Button>
    </div>
  );
}
