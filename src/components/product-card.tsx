"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg group">
      <div className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-video">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              data-ai-hint={product.imageHint}
            />
          </div>
        </Link>
      </div>
      <CardContent className="flex-grow p-2 flex flex-col">
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <Link href={`/products/${product.slug}`} className="flex-grow">
          <h3 className="text-sm font-medium leading-tight mb-1 group-hover:text-primary">{product.name}</h3>
        </Link>
         <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-2">
                <p className="text-base font-bold text-primary">৳{product.price.toFixed(2)}</p>
                {product.originalPrice && <p className="text-sm text-muted-foreground line-through">৳{product.originalPrice.toFixed(2)}</p>}
            </div>
            {product.isBestSelling && <Badge variant="secondary" className="text-xs bg-yellow-400/80 text-yellow-900">Best Seller</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <Button onClick={() => addToCart(product)} className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
