import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { z } from 'zod';
import type { CartItem } from '@/lib/types';


const orderSchema = z.object({
  transactionId: z.string(),
  total: z.number(),
  cart: z.array(z.any()),
  items: z.array(
    z.object({
      productId: z.string(),
      recipientEmail: z.string().email(),
    })
  ),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Invalid input", errors: validation.error.errors }, { status: 400 });
    }

    const { transactionId, total, cart, items } = validation.data;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: total,
        status: "Processing",
        transactionId,
        items: {
          create: cart.map((cartItem: CartItem) => {
            const recipientInfo = items.find(i => i.productId === cartItem.product.id)
            return {
              productId: cartItem.product.id,
              quantity: cartItem.quantity,
              price: cartItem.product.price,
              recipientEmail: recipientInfo?.recipientEmail
            }
          }),
        },
      },
      include: {
        items: true,
      }
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}
