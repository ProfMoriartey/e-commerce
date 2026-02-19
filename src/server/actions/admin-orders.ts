"use server"

import { db } from "~/server/db"
import { orders, orderItems, products } from "~/server/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Helper to check staff authorization
async function checkAdminAccess() {
  const { sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role
  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    throw new Error("Unauthorized access")
  }
}

export async function updateOrderItemQuantity(orderId: string, itemId: string, newQuantity: number) {
  await checkAdminAccess()

  if (newQuantity < 1) throw new Error("Quantity must be at least 1")

  // Update the specific item quantity
  await db
    .update(orderItems)
    .set({ quantity: newQuantity })
    .where(eq(orderItems.id, itemId))

  // Recalculate the total price for the entire order
  const updatedItems = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, orderId),
  })

  const newTotal = updatedItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  )

  await db
    .update(orders)
    .set({ totalPrice: newTotal })
    .where(eq(orders.id, orderId))

  revalidatePath("/admin/orders")
}

export async function confirmOrder(orderId: string) {
  await checkAdminAccess()

  // Run as a transaction to prevent partial updates
  await db.transaction(async (tx) => {
    const orderDetails = await tx.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { items: true },
    })

    if (!orderDetails) throw new Error("Order not found")
    if (orderDetails.status === "CONFIRMED") throw new Error("Order already confirmed")

    // Deduct stock for each item atomically
    for (const item of orderDetails.items) {
      await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId))
    }

    // Mark order as confirmed
    await tx
      .update(orders)
      .set({ 
        status: "CONFIRMED", 
        confirmedAt: new Date() 
      })
      .where(eq(orders.id, orderId))
  })

  revalidatePath("/admin/orders")
}