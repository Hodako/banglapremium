import type { Product as PrismaProduct, Category as PrismaCategory, Order as PrismaOrder, OrderItem as PrismaOrderItem, User as PrismaUser } from '@prisma/client';

export type Product = PrismaProduct & { category: PrismaCategory | null };
export type Category = PrismaCategory;

export interface CartItem {
  product: Product;
  quantity: number;
  recipientEmail?: string;
}

export type Order = PrismaOrder & {
    items: OrderItem[];
    user: PrismaUser | null;
}

export type OrderItem = PrismaOrderItem & { product: Product };

export type User = PrismaUser;

    