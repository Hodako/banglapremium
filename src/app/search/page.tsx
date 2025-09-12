'use client';

import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  if (!query) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Search for products</h2>
        <p className="mt-2 text-muted-foreground">Enter a term in the search bar to find products.</p>
      </div>
    );
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2">
        Search Results for &quot;{query}&quot;
      </h1>
      <p className="text-muted-foreground mb-8">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found.
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t find any products matching your search. Try another term.
          </p>
        </div>
      )}
    </div>
  );
}

function SearchLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-video w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchLoading />}>
            <SearchResults />
        </Suspense>
    )
}
