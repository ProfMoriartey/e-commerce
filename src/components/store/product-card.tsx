import Link from "next/link";
import Image from "next/image";
import { type products } from "~/server/db/schema"; // Import your Drizzle type
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { AddToCartButton } from "../cart/add-to-cart-button";

// Helper to format cents to dollars
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);
};

export function ProductCard({
  product,
}: {
  product: typeof products.$inferSelect;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="line-clamp-1 text-lg font-semibold">{product.name}</h3>
          <span className="font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
      </CardHeader>

      <CardContent className="flex grow p-4 pt-0">
        <p className="line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="gap-2 p-4">
        <Button asChild variant="outline" className="w-1/2">
          <Link href={`/store/${product.id}`}>View Details</Link>
        </Button>
        <AddToCartButton
          productId={product.id}
          disabled={product.stock === 0}
        />
      </CardFooter>
    </Card>
  );
}
