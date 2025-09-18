
'use client';

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/lib/types';

const CLOUDFLARE_IMAGE_DELIVERY_URL = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}`

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      fetch(`/api/products?q=${query}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data.products.map((p: Product) => ({...p, imageUrl: `${CLOUDFLARE_IMAGE_DELIVERY_URL}/${p.imageUrl}/public`})));
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [query]);
  
  if (isLoading) {
    return <SearchLoading />;
  }

  if (!query) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Search for products</h2>
        <p className="mt-2 text-muted-foreground">Enter a term in the search bar to find products.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2">
        Search Results for &quot;{query}&quot;
      </h1>
      <p className="text-muted-foreground mb-8">
        {products.length} {products.length === 1 ? 'product' : 'products'} found.
      </p>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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

    
