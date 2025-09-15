
import { ProductCard } from '@/components/product-card';
import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = {
  title: 'Best Sellers | Bangla Premium',
  description: 'Our most popular digital products and subscriptions.',
};

export default async function BestSellersPage() {
  const bestSellingProducts = await prisma.product.findMany({
    where: { isBestSelling: true },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
          <Star className="h-8 w-8 text-yellow-400" />
          Best Sellers
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Check out our most popular subscriptions.
        </p>
      </div>

      {bestSellingProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {bestSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No best sellers found</h2>
          <p className="mt-2 text-muted-foreground">
            Check back later to see our most popular items.
          </p>
        </div>
      )}
    </div>
  );
}
