import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditProductForm } from "~/components/admin/edit-product-form";
import { DeleteProductButton } from "~/components/admin/delete-product-button";

export default async function EditProductPage({
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

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-stone-900">Edit Product</h1>
      <div className="max-w-2xl rounded-md border bg-white p-6">
        <EditProductForm product={product} />
        <DeleteProductButton id={product.id} />
      </div>
    </div>
  );
}
