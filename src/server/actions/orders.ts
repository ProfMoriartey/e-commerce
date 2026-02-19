"use server"

import { db } from "~/server/db"
import { cart, orders, orderItems, products } from "~/server/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export async function processCheckout() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const cartItems = await db
    .select({
      cartId: cart.id,
      quantity: cart.quantity,
      product: products,
    })
    .from(cart)
    .innerJoin(products, eq(cart.productId, products.id))
    .where(eq(cart.userId, userId))

  if (cartItems.length === 0) {
    throw new Error("Cart is empty")
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const [newOrder] = await db
    .insert(orders)
    .values({
      userId,
      totalPrice: total,
      status: "PENDING",
      verificationCode,
    })
    .returning()

  const orderItemsData = cartItems.map((item) => ({
    orderId: newOrder.id,
    productId: item.product.id,
    quantity: item.quantity,
    priceAtPurchase: item.product.price,
  }))

  await db.insert(orderItems).values(orderItemsData)

  await db.delete(cart).where(eq(cart.userId, userId))

  redirect(`/checkout/success/${verificationCode}`)
}