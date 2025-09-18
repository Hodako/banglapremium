
import { ProductCard } from '@/components/product-card';
import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Product } from '@/lib/types';

const CLOUDFLARE_IMAGE_DELIVERY_URL = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}`

export const metadata: Metadata = {
  title: 'Best Sellers | Bangla Premium',
  description: 'Our most popular digital products and subscriptions.',
};

export default async function BestSellersPage() {
  const productsQuery = query(collection(firestore, 'products'), where('isBestSelling', '==', true));
  const querySnapshot = await getDocs(productsQuery);
  const bestSellingProducts = querySnapshot.docs.map(doc => {
      const data = doc.data() as Product
      return { 
          id: doc.id, ...data, 
          imageUrl: `${CLOUDFLARE_IMAGE_DELIVERY_URL}/${data.imageUrl}/public` 
      } as Product
    }
  );

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
