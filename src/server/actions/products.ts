"use server";

import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { productSchema } from "~/lib/validators/product"; // Adjust import path
import { redirect } from "next/navigation";

export async function createProduct(data: unknown) {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  // 1. Check Permissions
  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    throw new Error("Unauthorized");
  }

  // 2. Validate Data
  const parsed = productSchema.parse(data);

  // 3. Insert into DB (Convert Price to Cents)
  await db.insert(products).values({
    name: parsed.name,
    description: parsed.description,
    price: Math.round(parsed.price * 100), // $10.99 -> 1099
    stock: parsed.stock,
    category: parsed.category,
    imageUrl: parsed.imageUrl,
  });

  // 4. Redirect back to inventory
  redirect("/admin/products");
}