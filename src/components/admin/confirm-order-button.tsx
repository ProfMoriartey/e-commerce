"use client";

import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import { confirmOrder } from "~/server/actions/admin-orders";
import { toast } from "sonner";

export function ConfirmOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await confirmOrder(orderId);
        toast.success("Order confirmed successfully");
      } catch (error) {
        toast.error("Failed to confirm order");
      }
    });
  }

  return (
    <Button
      onClick={handleConfirm}
      disabled={isPending}
      className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
    >
      {isPending ? "Confirming..." : "Confirm Payment"}
    </Button>
  );
}
