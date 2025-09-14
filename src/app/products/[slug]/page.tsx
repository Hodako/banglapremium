import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle, Shield } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { AddToCartButton } from './add-to-cart-button';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: 'Product not found',
    };
  }

  return {
    title: `${product.name} | Bangla Premium`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { slug:string } }) {
  const product = products.find((p) => p.slug === params.slug);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.imageHint}
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">{product.category}</span>
          <h1 className="font-headline mt-2 text-4xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.longDescription}</p>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-bold text-foreground">৳{product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-2xl text-muted-foreground line-through">৳{product.originalPrice.toFixed(2)}</span>}
          </div>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Instant Digital Delivery</span>
            </div>
             <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure & Encrypted Transaction</span>
            </div>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl font-headline">You Might Also Like</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}
