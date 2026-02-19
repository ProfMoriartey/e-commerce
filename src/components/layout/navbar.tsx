import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { getCartItems } from "~/server/actions/cart";
import { CartSheet } from "~/components/cart/cart-sheet";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export async function Navbar() {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  const isAdmin =
    role === "developer" || role === "admin" || role === "personnel";

  const cartItems = await getCartItems();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-75 flex-col">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-bold">
                    My Store
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6">
                  <Link
                    href="/store"
                    className="text-lg font-medium hover:text-gray-600"
                  >
                    Shop
                  </Link>
                  <SignedIn>
                    <Link
                      href="/orders"
                      className="text-lg font-medium hover:text-gray-600"
                    >
                      My Orders
                    </Link>
                  </SignedIn>
                  {isAdmin && (
                    <Link
                      href="/admin/orders"
                      className="text-lg font-medium text-blue-600"
                    >
                      Staff Dashboard
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href="/"
            className="hidden text-xl font-bold tracking-tight md:block"
          >
            My Store
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/store" className="text-gray-600 hover:text-black">
            Shop
          </Link>
          <SignedIn>
            <Link href="/orders" className="text-gray-600 hover:text-black">
              My Orders
            </Link>
          </SignedIn>
          {isAdmin && (
            <Link
              href="/admin/orders"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Staff Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <CartSheet items={cartItems} />
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
