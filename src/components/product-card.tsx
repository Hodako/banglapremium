
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((Number(product.originalPrice!) - Number(product.price)) / Number(product.originalPrice!)) * 100)
    : 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg group">
      <Link href={`/products/${product.slug}`} className="block p-0">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={product.imageUrl!}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              data-ai-hint={product.imageHint!}
            />
             {product.isBestSelling && (
              <Badge variant="secondary" className="absolute top-2 left-2 bg-amber-400 text-amber-900 font-bold gap-1 pl-1.5">
                <Star className="h-3 w-3" /> Best Seller
              </Badge>
            )}
             {hasDiscount && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
      </Link>
      <CardContent className="flex flex-1 flex-col p-3">
        {/* <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p> */}
        <Link href={`/products/${product.slug}`} className="flex-grow">
          <h3 className="text-sm font-medium leading-tight mb-2 group-hover:text-primary">{product.name}</h3>
        </Link>
         <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-1.5">
                <p className="text-sm sm:text-base font-bold text-primary">৳{Number(product.price).toFixed(2)}</p>
                {product.originalPrice && <p className="text-xs sm:text-sm text-muted-foreground line-through">৳{Number(product.originalPrice).toFixed(2)}</p>}
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button onClick={() => addToCart(product)} className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
