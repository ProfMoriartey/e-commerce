import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ConfirmOrderButton } from "~/components/admin/confirm-order-button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default async function PersonnelOrdersPage() {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (role !== "developer" && role !== "admin" && role !== "personnel") {
    redirect("/");
  }

  const pendingOrders = await db.query.orders.findMany({
    where: eq(orders.status, "PENDING"),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Pending Orders</h1>

      {pendingOrders.length === 0 ? (
        <p className="text-gray-500">No pending orders require verification.</p>
      ) : (
        <div className="grid gap-6">
          {pendingOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
                <CardTitle className="font-mono text-xl tracking-widest text-blue-600">
                  Code: {order.verificationCode}
                </CardTitle>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${(order.totalPrice / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-gray-500">
                        ${(item.priceAtPurchase / 100).toFixed(2)} each
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end border-t pt-4">
                  <ConfirmOrderButton orderId={order.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
