"use client";

import { useTransition } from "react";
import { toggleProductStatus } from "~/server/actions/products";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export function ToggleStatusButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleProductStatus(id, isActive);
        toast.success(isActive ? "Product deactivated" : "Product activated");
      } catch (error) {
        toast.error("Failed to update status");
      }
    });
  }

  return (
    <Button
      variant={isActive ? "outline" : "secondary"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? "Updating..." : isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
