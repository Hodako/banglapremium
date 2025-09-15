
import type { Product as PrismaProduct, Category as PrismaCategory, Order as PrismaOrder, OrderItem as PrismaOrderItem, User as PrismaUser } from '@prisma/client';

export type Product = PrismaProduct;
export type Category = PrismaCategory;

export interface CartItem {
  product: Product;
  quantity: number;
  recipientEmail?: string;
}

export type Order = PrismaOrder & {
    items: (PrismaOrderItem & { product: Product })[];
    user: PrismaUser | null;
}

export type User = PrismaUser;
