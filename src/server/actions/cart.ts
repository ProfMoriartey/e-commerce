"use server"

import { db } from "~/server/db"
import { cart, products } from "~/server/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function addToCart(productId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("You must be logged in to add items")
  }

  const existingItem = await db.query.cart.findFirst({
    where: and(
      eq(cart.userId, userId),
      eq(cart.productId, productId)
    )
  })

  if (existingItem) {
    await db
      .update(cart)
      .set({ quantity: existingItem.quantity + 1 })
      .where(eq(cart.id, existingItem.id))
  } else {
    await db.insert(cart).values({
      userId,
      productId,
      quantity: 1
    })
  }

  revalidatePath("/store")
  revalidatePath(`/store/${productId}`)
}

export async function getCartItems() {
  const { userId } = await auth()
  
  if (!userId) return []

  return await db
    .select({
      cartId: cart.id,
      quantity: cart.quantity,
      product: {
        id: products.id,
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl,
        stock: products.stock, 
      },
    })
    .from(cart)
    .innerJoin(products, eq(cart.productId, products.id))
    .where(eq(cart.userId, userId))
}

export async function removeCartItem(cartId: string) {
  const { userId } = await auth()
  
  if (!userId) throw new Error("Unauthorized")

  await db
    .delete(cart)
    .where(and(eq(cart.id, cartId), eq(cart.userId, userId)))

  revalidatePath("/store")
}

export async function updateCartItemQuantity(cartId: string, quantity: number) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (quantity <= 0) {
    await db
      .delete(cart)
      .where(and(eq(cart.id, cartId), eq(cart.userId, userId)))
  } else {
    await db
      .update(cart)
      .set({ quantity })
      .where(and(eq(cart.id, cartId), eq(cart.userId, userId)))
  }

  revalidatePath("/store")
}