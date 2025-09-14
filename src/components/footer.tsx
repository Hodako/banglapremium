import Link from 'next/link';
import { Sparkles, Twitter, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Sparkles className="h-6 w-6" />
              <span className="font-headline">Bangla Premium</span>
            </Link>
            <p className="text-muted-foreground">
              Your one-stop shop for digital subscriptions and services.
            </p>
          </div>
          <div>
            <h3 className="font-semibold tracking-wide text-foreground">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary">Categories</Link></li>
              <li><Link href="/best-sellers" className="text-muted-foreground hover:text-primary">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold tracking-wide text-foreground">About</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about/our-story" className="text-muted-foreground hover:text-primary">Our Story</Link></li>
              <li><Link href="/about/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="/about/contact-us" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="/legal/terms-and-conditions" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold tracking-wide text-foreground">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bangla Premium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
