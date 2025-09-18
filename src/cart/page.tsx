'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CLOUDFLARE_IMAGE_DELIVERY_URL } from '@/lib/cloudflare';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Add some products to get started.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {cart.map((item, index) => (
                  <div key={item.product.id} className="flex flex-col gap-4 p-4 sm:flex-row">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={`${CLOUDFLARE_IMAGE_DELIVERY_URL}/${item.product.imageUrl}/public`}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={item.product.imageHint}
                      />
                    </div>
                    <div className="flex flex-grow flex-col justify-between gap-2 sm:gap-0">
                      <div className="flex justify-between">
                        <h2 className="font-medium hover:underline">
                          <Link href={`/products/${item.product.slug}`}>{item.product.name}</Link>
                        </h2>
                        <p className="font-semibold">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">৳{item.product.price.toFixed(2)} each</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
