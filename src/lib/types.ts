
// The Prisma types are removed as we are no longer using Prisma.
// These will be replaced with Firestore-specific types as we build out the data models.

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  imageHint?: string | null;
  categoryId: string;
  isFeatured?: boolean;
  isBestSelling?: boolean;
  releaseDate?: string | null;
  category: { name: string; } | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  imageHint?: string | null;
};

export interface CartItem {
  product: Product;
  quantity: number;
  recipientEmail?: string;
}

// These are placeholder types. They will be updated.
export type Order = any; 
export type OrderItem = any;
export type User = any;
