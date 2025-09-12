'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const total = searchParams.get('total');

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Thank You for Your Order!</CardTitle>
          <CardDescription>Your order has been received and is now being processed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="my-4 rounded-md border bg-muted/50 p-4 text-left">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <Package className="h-4 w-4" />
              Order Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount Paid:</span>
              <span className="font-medium">৳{total ? parseFloat(total).toFixed(2) : '0.00'}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              You will receive an email confirmation shortly with your subscription details. Please check your spam folder if you don't see it.
            </p>
          </div>
          <Button asChild className="mt-6 w-full sm:w-auto">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    )
}
