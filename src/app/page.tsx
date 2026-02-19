import Link from "next/link";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "~/components/ui/button";
import { ProductCard } from "~/components/store/product-card";

export default async function HomePage() {
  const latestProducts = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    limit: 4,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <section className="bg-stone-100 px-4 py-24">
        <div className="container mx-auto max-w-5xl space-y-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-stone-900 md:text-7xl">
            Redesign Your Space
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-stone-600">
            Discover curated furniture and decor to elevate your apartment. Shop
            our latest collection of modern home essentials.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild size="lg" className="px-8 text-lg">
              <Link href="/store">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 text-lg"
            >
              <Link href="/store?category=Home">View Collections</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">New Arrivals</h2>
            <p className="mt-2 text-stone-500">
              The latest additions to our catalog.
            </p>
          </div>
          <Link
            href="/store"
            className="font-medium text-stone-900 hover:underline"
          >
            View All
          </Link>
        </div>

        {latestProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-stone-50 py-20 text-center">
            <p className="text-stone-500">Your store is currently empty.</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/admin/products/new">Add your first product</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-auto bg-stone-900 px-4 py-20 text-stone-50">
        <div className="container mx-auto grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:text-left">
          <div>
            <h3 className="mb-4 text-xl font-bold">My Store</h3>
            <p className="text-stone-400">Curated items for modern living.</p>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/store" className="hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Newsletter</h3>
            <p className="mb-4 text-stone-400">
              Get updates on new arrivals and sales.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded px-4 py-2 text-stone-900 focus:outline-none"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
