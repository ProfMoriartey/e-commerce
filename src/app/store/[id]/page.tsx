import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { AddToCartButton } from "~/components/cart/add-to-cart-button";
import { ImageGallery } from "~/components/store/image-gallery";

export default async function SingleItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price / 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <ImageGallery images={product.imageUrls} />
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="mt-2 text-xl font-semibold text-green-600">
              {formattedPrice}
            </p>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 capitalize">
              Category: {product.category}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock > 0 ? product.stock : "Out of stock"}
            </span>
          </div>

          <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row">
            <AddToCartButton
              productId={product.id}
              disabled={product.stock === 0}
            />
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Add to Wishlist
            </Button>
          </div>

          <div className="mt-8 border-t pt-8">
            <h2 className="mb-4 text-2xl font-bold">Customer Reviews</h2>
            <p className="text-gray-500">Reviews will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
