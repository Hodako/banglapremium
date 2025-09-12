'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Button size="lg" className="w-full sm:w-auto" onClick={() => addToCart(product)}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
}
