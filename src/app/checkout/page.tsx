
"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";


const checkoutSchema = z.object({
  transactionId: z.string().min(5, "Transaction ID is required"),
  items: z.array(
    z.object({
      productId: z.string(),
      recipientEmail: z
        .string()
        .email("Invalid email address for recipient"),
    })
  ),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const user = session?.user;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      transactionId: "",
      items: cart.map(item => ({
        productId: item.product.id,
        recipientEmail: item.recipientEmail || user?.email || "",
      })),
    },
  });
  
  useEffect(() => {
    form.reset({
       transactionId: "",
       items: cart.map(item => ({
        productId: item.product.id,
        recipientEmail: item.recipientEmail || user?.email || "",
      })),
    })
  }, [cart, user, form])


  const { fields } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/checkout');
    }
    if (status === 'authenticated' && cart.length === 0) {
      router.replace("/products");
    }
  }, [cart.length, router, status]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          total,
          cart
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      
      clearCart();
      router.push(`/order-confirmation?total=${total.toFixed(2)}`);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was an issue placing your order. Please try again."
      })
    }

  };

  if (status === 'loading' || (status === 'authenticated' && cart.length === 0) || !user) {
    return (
        <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[80vh] px-4 py-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Complete your payment and enter the details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="mb-6 flex items-center justify-center gap-4">
                    <Image src="https://www.logo.wine/a/logo/BKash/BKash-bKash-Logo.wine.svg" alt="bKash" width={100} height={50} className="object-contain"/>
                    <Image src="https://mma.prnewswire.com/media/1918049/Nagad_Logo.jpg" alt="Nagad" width={100} height={50} className="object-contain"/>
                </div>
              <Alert className="mb-6">
                 <Terminal className="h-4 w-4" />
                <AlertTitle>Manual Payment Instructions</AlertTitle>
                <AlertDescription>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Send BDT {total.toFixed(2)} to our bKash/Nagad number: <strong>01234567890</strong>.</li>
                    <li>Use your order total as the reference.</li>
                    <li>Copy the Transaction ID you receive via SMS.</li>
                    <li>Paste the Transaction ID in the form below.</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>bKash/Nagad Transaction ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 8M7A9B2C1D" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                     <Label>Recipient Emails</Label>
                      <p className="text-sm text-muted-foreground">Enter the email where each subscription should be sent.</p>
                     {fields.map((field, index) => {
                        const cartItem = cart[index];
                        return (
                             <FormField
                                key={field.id}
                                control={form.control}
                                name={`items.${index}.recipientEmail`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal">{cartItem.product.name}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="recipient@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                     })}
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Placing Order...' : 'Complete Purchase'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="order-1 lg:order-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={item.product.imageHint}
                          />
                           <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                        </div>
                      </div>
                      <p className="font-medium">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span>৳0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
