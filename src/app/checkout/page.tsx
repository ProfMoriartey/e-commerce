import { getCartItems } from "~/server/actions/cart";
import { processCheckout } from "~/server/actions/orders";
import { Button } from "~/components/ui/button";

export default async function CheckoutPage() {
  const items = await getCartItems();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total / 100);

  return (
    <div className="mx-auto mt-12 max-w-3xl rounded-lg border p-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="mb-8 space-y-4">
        {items.map((item) => (
          <div key={item.cartId} className="flex justify-between border-b pb-4">
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">
              ${((item.product.price * item.quantity) / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 flex justify-between text-2xl font-bold">
        <span>Total</span>
        <span>{formattedTotal}</span>
      </div>

      <form action={processCheckout}>
        <Button size="lg" className="w-full" disabled={items.length === 0}>
          Confirm Order
        </Button>
      </form>
    </div>
  );
}
