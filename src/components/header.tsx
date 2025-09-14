
"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { CartSheet } from "@/components/cart-sheet";
import { FormEvent, useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { products } from "@/lib/data";
import Image from "next/image";

export function Header() {
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
    // Check for token to determine login status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for a custom event that we can dispatch on login/logout
    window.addEventListener('authChange', handleStorageChange);


    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSuggestionsVisible(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
      setSuggestions(filtered);
      setIsSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setIsSuggestionsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);


  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/best-sellers", label: "Best Sellers" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-2 md:gap-6">
             <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm">
                    <SheetHeader>
                        <SheetTitle>
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-lg font-bold text-primary"
                                onClick={closeMobileMenu}
                                >
                                <Sparkles className="h-6 w-6" />
                                <span className="font-headline">Digital Direct</span>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                     <div className="flex h-full flex-col">
                      <nav className="mt-8 flex flex-col gap-4">
                        {navLinks.map((link) => (
                           <Link
                              key={link.href}
                              href={link.href}
                              className={`text-lg font-medium ${pathname === link.href ? 'text-primary' : ''}`}
                               onClick={closeMobileMenu}
                            >
                              {link.label}
                            </Link>
                        ))}
                      </nav>
                      <div className="mt-auto border-t pt-4 flex flex-col gap-2">
                           {isLoggedIn ? (
                             <Link href="/account" onClick={closeMobileMenu}>
                               <Button variant="ghost" className="w-full justify-start">
                                 <User className="mr-2 h-5 w-5" />
                                 My Account
                               </Button>
                             </Link>
                           ) : (
                             <Link href="/login" onClick={closeMobileMenu}>
                               <Button variant="outline" className="w-full justify-center">
                                 Login / Signup
                               </Button>
                             </Link>
                           )}
                      </div>
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

          <div ref={searchRef} className="flex-1 px-4 relative">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search for products, brands and more"
                    className="h-10 w-full rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background focus:ring-primary pl-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => { if(searchQuery) setIsSuggestionsVisible(true)}}
                  />
                </div>
              </form>
               {isSuggestionsVisible && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full rounded-md border bg-background shadow-lg z-50">
                  <ul className="py-1">
                    {suggestions.map(product => (
                      <li key={product.id}>
                        <Link 
                          href={`/products/${product.slug}`}
                          className="flex items-center gap-4 px-4 py-2 hover:bg-muted"
                          onClick={() => setIsSuggestionsVisible(false)}
                        >
                          <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">৳{product.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li className="border-t mt-1 pt-1">
                       <Link 
                          href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                          className="w-full text-center block px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
                          onClick={() => setIsSuggestionsVisible(false)}
                        >
                          View all results for &quot;{searchQuery}&quot;
                        </Link>
                    </li>
                  </ul>
                </div>
              )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/account" className="flex">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
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
          </div>
        </div>
        <nav className="hidden md:block border-t">
          <div className="container mx-auto px-4">
             <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 text-sm font-medium transition-colors hover:text-foreground ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
