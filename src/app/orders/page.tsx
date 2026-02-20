import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default async function CustomerOrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
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
      <h1 className="mb-8 text-3xl font-bold">Your Order History</h1>

      {userOrders.length === 0 ? (
        <p className="text-gray-500">You have no past orders.</p>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
                <div>
                  <CardTitle className="text-lg">
                    Order Code: {order.verificationCode}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${(order.totalPrice / 100).toFixed(2)}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      order.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                        <Image
                          src={item.product.imageUrls[0] || ""}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} | $
                          {(item.priceAtPurchase / 100).toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right font-semibold">
                        $
                        {((item.priceAtPurchase * item.quantity) / 100).toFixed(
                          2,
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
