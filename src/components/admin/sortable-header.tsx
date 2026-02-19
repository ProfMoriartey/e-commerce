"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

export function SortableHeader({
  label,
  columnKey,
}: {
  label: string;
  columnKey: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort");
  const currentOrder = searchParams.get("order");

  function handleSort() {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSort === columnKey && currentOrder === "asc") {
      params.set("order", "desc");
    } else {
      params.set("sort", columnKey);
      params.set("order", "asc");
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className="h-8 px-2 font-semibold hover:bg-stone-100"
    >
      {label}
      {currentSort === columnKey && (
        <span className="ml-2">{currentOrder === "asc" ? "↑" : "↓"}</span>
      )}
    </Button>
  );
}
