import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { ToggleStatusButton } from "~/components/admin/toggle-status-button";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-stone-500"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              allProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-stone-100">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <ToggleStatusButton
                      id={product.id}
                      isActive={product.isActive}
                    />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
