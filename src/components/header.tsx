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
      // Close mobile sheet if open
      const closeButton = document.querySelector('[data-radix-dialog-close]');
      if(closeButton instanceof HTMLElement) closeButton.click();
      
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
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-2 md:gap-6">
            <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm">
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
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 text-lg font-bold text-primary"
            >
              <Sparkles className="h-6 w-6" />
              <span className="font-headline">Digital Direct</span>
            </Link>
          </div>

          <div className="flex-1 px-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search for products, brands and more"
                    className="h-10 w-full rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background focus:ring-primary pl-10"
                  />
                </div>
              </form>
          </div>

          <div className="flex items-center gap-2">
              <Link href="/account" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <User className="mr-1 h-5 w-5" />
                  Account
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
          </div>
        </div>
        <div className="hidden md:block border-t">
          <div className="container mx-auto px-4">
             <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
