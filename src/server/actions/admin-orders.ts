"use server"

import { db } from "~/server/db"
import { orders } from "~/server/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function confirmOrder(orderId: string) {
  const { sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role

  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    throw new Error("Unauthorized")
  }

  await db
    .update(orders)
    .set({ 
      status: "CONFIRMED", 
      confirmedAt: new Date() 
    })
    .where(eq(orders.id, orderId))

  revalidatePath("/admin/orders")
}