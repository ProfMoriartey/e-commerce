import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Order Status Enum
export const statusEnum = pgEnum("order_status", ["PENDING", "CONFIRMED", "CANCELLED"]);

// 2. Products Table
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Store in cents (e.g., 1000 = $10.00)
  category: text("category").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Orders Table (The Core of your Verification System)
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // Clerk User ID
  totalPrice: integer("total_price").notNull(),
  status: statusEnum("status").default("PENDING").notNull(),
  verificationCode: text("verification_code").unique(), // Generated on checkout
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
});

// 4. Order Items (Items linked to a specific order)
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: integer("price_at_purchase").notNull(),
});

// 5. Cart Table (Persisted across devices via Clerk ID)
export const cart = pgTable("cart", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// 6. Wishlist Table
export const wishlist = pgTable("wishlist", {
  userId: text("user_id").notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.productId] }),
}));

// 7. Reviews Table (Text only as requested)
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Relations (Optional but helpful for Drizzle queries)
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(reviews),
}));