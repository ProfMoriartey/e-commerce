"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function TableSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex gap-4">
      <Input
        placeholder="Search products by name..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateUrl("search", e.target.value)}
        className="max-w-sm"
      />
      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(value) => updateUrl("status", value)}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
