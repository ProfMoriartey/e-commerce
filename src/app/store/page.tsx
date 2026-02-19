import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { ProductCard } from "~/components/store/product-card";
import { FilterSidebar } from "~/components/store/filter-sidebar";
import { and, asc, desc, eq, gte, ilike, lte } from "drizzle-orm";

type SearchParams = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // 1. Await the params ONCE at the top
  const params = await searchParams;

  const filters = [];

  // 2. TypeScript now correctly remembers the type inside these blocks
  if (params.search) {
    filters.push(ilike(products.name, `%${params.search}%`));
  }
  if (params.category) {
    filters.push(eq(products.category, params.category)); // Error is gone!
  }
  if (params.minPrice) {
    filters.push(gte(products.price, Number(params.minPrice) * 100));
  }
  if (params.maxPrice) {
    filters.push(lte(products.price, Number(params.maxPrice) * 100));
  }

  // 3. Determine Sort Order
  let orderBy = desc(products.createdAt);
  switch ((await searchParams).sort) {
    case "price_asc":
      orderBy = asc(products.price);
      break;
    case "price_desc":
      orderBy = desc(products.price);
      break;
    case "name_asc":
      orderBy = asc(products.name);
      break;
    case "newest":
    default:
      orderBy = desc(products.createdAt);
      break;
  }

  // 4. Fetch Data
  const allProducts = await db.query.products.findMany({
    where: and(...filters),
    orderBy: orderBy,
  });

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:flex-row">
      {/* Sidebar */}
      <div className="flex w-full shrink-0 md:w-64">
        <FilterSidebar />
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <h1 className="mb-6 text-3xl font-bold">Store</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {allProducts.length === 0 && (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
