
"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
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
import { Terminal, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { CLOUDFLARE_IMAGE_DELIVERY_URL } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";

const checkoutSchema = z.object({
  transactionId: z.string().min(5, "Transaction ID is required"),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      price: z.number(),
      recipientEmail: z.string().email("Invalid email address for recipient"),
      uniqueCartId: z.string(),
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
        productName: item.product.name,
        price: item.product.price,
        recipientEmail: item.recipientEmail || user?.email || "",
        uniqueCartId: item.id,
      })),
    },
  });
  
  useEffect(() => {
    form.reset({
       transactionId: "",
       items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        recipientEmail: item.recipientEmail || user?.email || "",
        uniqueCartId: item.id,
      })),
    })
  }, [cart, user, form])


  useEffect(() => {
    if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/checkout');
    }
    if (status === 'authenticated' && cart.length === 0) {
      router.replace("/products");
    }
  }, [cart.length, router, status]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!user?.id) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to place an order."
        });
        return;
    }
    try {
        const orderData = {
            userId: user.id,
            items: data.items.map(({ productName, price, recipientEmail }) => ({ productName, price, recipientEmail })),
            total: total,
            transactionId: data.transactionId,
            status: 'pending',
            createdAt: new Date()
        }
        await addDoc(collection(firestore, 'orders'), orderData);
        
        clearCart();
        toast({
            title: "Order Placed!",
            description: "Your order has been successfully placed."
        });
        router.push(`/order-confirmation?total=${total}`);

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Order Failed",
            description: "There was a problem placing your order. Please try again."
        });
        console.error("Order submission error: ", error);
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
        <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
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
                     <FormLabel>Recipient Emails</FormLabel>
                      <p className="text-sm text-muted-foreground">Enter the email where each subscription should be sent.</p>
                      <AnimatePresence>
                         {form.getValues('items').map((item, index) => (
                            <motion.div
                                key={item.uniqueCartId}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.recipientEmail`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-normal">{item.productName}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="recipient@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </motion.div>
                         ))}
                      </AnimatePresence>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Placing Order...' : (
                        <>
                            <Lock className="mr-2 h-4 w-4" />
                            Complete Purchase
                        </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div 
                        key={item.id} 
                        className="flex items-center justify-between"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={`${CLOUDFLARE_IMAGE_DELIVERY_URL}/${item.product.imageUrl}/public`}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">1 Unit</p>
                        </div>
                      </div>
                      <p className="font-medium">৳{item.product.price.toFixed(2)}</p>
                    </motion.div>
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
        </motion.div>
      </div>
    </div>
  );
}
