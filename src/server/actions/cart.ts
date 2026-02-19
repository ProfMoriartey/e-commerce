"use server"

import { db } from "~/server/db"
import { cart } from "~/server/db/schema"
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