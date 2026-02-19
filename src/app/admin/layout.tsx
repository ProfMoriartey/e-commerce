import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 border-r bg-white md:block">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-stone-900">Staff Portal</h2>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/admin"
            className="rounded px-4 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="rounded px-4 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          >
            Pending Orders
          </Link>
          <Link
            href="/admin/products"
            className="rounded px-4 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          >
            Products
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
