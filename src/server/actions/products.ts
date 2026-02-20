"use server";

import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { productSchema } from "~/lib/validators/product"; // Adjust import path
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

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
   imageUrls: parsed.imageUrls,
  });

  // 4. Redirect back to inventory
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const { sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role

  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price")) * 100
  const stock = Number(formData.get("stock"))
  const category = formData.get("category") as string

  await db
    .update(products)
    .set({
      name,
      description,
      price,
      stock,
      category,
    })
    .where(eq(products.id, id))

  revalidatePath("/admin/products")
  revalidatePath(`/store/${id}`)
  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  const { sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role

  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    throw new Error("Unauthorized")
  }

  await db.delete(products).where(eq(products.id, id))

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  const { sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role

  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    throw new Error("Unauthorized")
  }

  await db
    .update(products)
    .set({ isActive: !currentStatus })
    .where(eq(products.id, id))

  revalidatePath("/admin/products")
  revalidatePath("/store")
  revalidatePath("/")
}