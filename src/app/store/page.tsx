import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { ProductCard } from "~/components/store/product-card";

export default async function StorePage() {
  // 1. Fetch all products (sorted by newest)
  const allProducts = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Our Collection</h1>

      {/* 2. Grid Layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 3. Empty State */}
      {allProducts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-xl text-gray-500">No products found.</p>
        </div>
      )}
    </div>
  );
}
