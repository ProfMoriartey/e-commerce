import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { desc, asc, ilike, eq, and } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
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
import { TableSearch } from "~/components/admin/table-search";
import { SortableHeader } from "~/components/admin/sortable-header";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const search =
    typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "createdAt";
  const order =
    typeof resolvedParams.order === "string" ? resolvedParams.order : "desc";
  const status =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "all";

  const conditions = [];

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }

  if (status === "active") {
    conditions.push(eq(products.isActive, true));
  }

  if (status === "inactive") {
    conditions.push(eq(products.isActive, false));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderClause;

  switch (sort) {
    case "name":
      orderClause = order === "asc" ? asc(products.name) : desc(products.name);
      break;
    case "price":
      orderClause =
        order === "asc" ? asc(products.price) : desc(products.price);
      break;
    case "stock":
      orderClause =
        order === "asc" ? asc(products.stock) : desc(products.stock);
      break;
    case "category":
      orderClause =
        order === "asc" ? asc(products.category) : desc(products.category);
      break;
    default:
      orderClause =
        order === "asc" ? asc(products.createdAt) : desc(products.createdAt);
  }

  const allProducts = await db.query.products.findMany({
    where: whereClause,
    orderBy: [orderClause],
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>

      <Suspense
        fallback={<div className="py-10 text-center">Loading controls...</div>}
      >
        <TableSearch />
      </Suspense>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Image</TableHead>
              <TableHead>
                <Suspense fallback="Name">
                  <SortableHeader label="Name" columnKey="name" />
                </Suspense>
              </TableHead>
              <TableHead>
                <Suspense fallback="Category">
                  <SortableHeader label="Category" columnKey="category" />
                </Suspense>
              </TableHead>
              <TableHead>
                <Suspense fallback="Status">Status</Suspense>
              </TableHead>
              <TableHead>
                <Suspense fallback="Price">
                  <SortableHeader label="Price" columnKey="price" />
                </Suspense>
              </TableHead>
              <TableHead>
                <Suspense fallback="Stock">
                  <SortableHeader label="Stock" columnKey="stock" />
                </Suspense>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-stone-500"
                >
                  No products match your search
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
                  <TableCell className="px-4 font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="px-4 capitalize">
                    {product.category}
                  </TableCell>
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
                  <TableCell className="px-4">
                    ${(product.price / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4">{product.stock}</TableCell>
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
