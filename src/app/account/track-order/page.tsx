
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, Box, StepSeparator } from "@/components/ui/stepper";
import { Check, Package, Truck } from "lucide-react";
import { useState } from "react";

const steps = [
  { label: 'Order Placed', description: 'We have received your order.' },
  { label: 'Processing', description: 'Your payment is being verified.' },
  { label: 'Delivered', description: 'Your subscription codes have been sent.' },
]

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [orderStatus, setOrderStatus] = useState<number | null>(null);

    const handleTrackOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Mock tracking logic
        if (orderId) {
            const lastDigit = parseInt(orderId.slice(-1), 16) % 4; // 0, 1, 2, 3
            setOrderStatus(lastDigit);
        }
    }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Enter Order Details</CardTitle>
                <CardDescription>Enter your Order ID to see its status.</CardDescription>
            </CardHeader>
            <form onSubmit={handleTrackOrder}>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="order-id">Order ID</Label>
                        <Input 
                            id="order-id" 
                            placeholder="e.g., ORD-001"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                         />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        <Truck className="mr-2 h-4 w-4" />
                        Track Order
                    </Button>
                </CardFooter>
            </form>
        </Card>

        {orderStatus !== null && (
            <Card className="max-w-lg mx-auto mt-8">
                <CardHeader>
                     <CardTitle>Order Status</CardTitle>
                    <CardDescription>Here is the current status of order #{orderId}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Stepper index={orderStatus}>
                        {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator>
                            <StepStatus
                                complete={<Check className="h-4 w-4" />}
                                incomplete={<StepNumber />}
                                active={<Package className="h-4 w-4 animate-pulse" />}
                            />
                            </StepIndicator>

                            <Box>
                            <StepTitle>{step.label}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>
        )}

    </div>
  );
}
