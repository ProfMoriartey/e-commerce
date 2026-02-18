"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Example categories - you might fetch these dynamically later
const CATEGORIES = ["Clothing", "Electronics", "Home", "Accessories"];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for immediate UI feedback
  const [priceRange, setPriceRange] = useState([0, 1000]); // $0 - $1000

  // Helper to update URL params
  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset page to 1 when filtering
    params.delete("page");

    startTransition(() => {
      router.push(`/store?${params.toString()}`);
    });
  };

  return (
    <aside className="w-full space-y-8 border-r p-4 md:w-64">
      {/* 1. Search */}
      <div className="space-y-2">
        <h3 className="font-semibold">Search</h3>
        <Input
          placeholder="Search products..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            // Simple debounce could be added here
            updateFilters("search", e.target.value);
          }}
        />
      </div>

      {/* 2. Categories */}
      <div className="space-y-2">
        <h3 className="font-semibold">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={cat}
                checked={searchParams.get("category") === cat}
                onCheckedChange={(checked) => {
                  updateFilters("category", checked ? cat : null);
                }}
              />
              <Label htmlFor={cat}>{cat}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold">Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          onValueCommit={(val) => {
            updateFilters("minPrice", val[0].toString());
            updateFilters("maxPrice", val[1].toString());
          }}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>${searchParams.get("minPrice") ?? 0}</span>
          <span>${searchParams.get("maxPrice") ?? 1000}+</span>
        </div>
      </div>

      {/* 4. Sort Order */}
      <div className="space-y-2">
        <h3 className="font-semibold">Sort By</h3>
        <Select
          onValueChange={(val) => updateFilters("sort", val)}
          defaultValue={searchParams.get("sort") ?? "newest"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/store")}
      >
        Clear All Filters
      </Button>
    </aside>
  );
}
