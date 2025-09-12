"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { CartSheet } from "@/components/cart-sheet";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Header() {
  const { cart } = useCart();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "#", label: "Best Sellers" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-primary"
            >
              <Sparkles className="h-6 w-6" />
              <span className="font-headline">Digital Direct</span>
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search products..."
                  className="h-9 w-40 pl-9 lg:w-64"
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User account</span>
                </Button>
              </Link>

              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full max-w-sm">
                     <div className="flex h-full flex-col">
                      <div className="flex items-center justify-between border-b pb-4">
                         <Link
                          href="/"
                          className="flex items-center gap-2 text-lg font-bold text-primary"
                        >
                          <Sparkles className="h-6 w-6" />
                          <span className="font-headline">Digital Direct</span>
                        </Link>
                        <SheetClose asChild>
                           <Button variant="ghost" size="icon">
                            <X className="h-5 w-5" />
                          </Button>
                        </SheetClose>
                      </div>
                      <nav className="mt-8 flex flex-col gap-4">
                        {navLinks.map((link) => (
                          <SheetClose asChild key={link.href}>
                             <Link
                              href={link.href}
                              className="text-lg font-medium"
                            >
                              {link.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </nav>
                       <form onSubmit={handleSearch} className="mt-8">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="search"
                            name="search"
                            placeholder="Search products..."
                            className="w-full pl-9"
                          />
                        </div>
                      </form>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
