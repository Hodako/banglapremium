
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
  category?: { name: string; }; 
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
  id: string; // Unique identifier for each item in the cart
  product: Product;
  recipientEmail?: string;
}

export type Order = {
    id: string;
    userId: string;
    items: {
      productName: string;
      price: number;
      recipientEmail: string;
    }[];
    total: number;
    transactionId: string;
    status: 'pending' | 'processing' | 'delivered';
    createdAt: {
        toDate: () => Date;
    };
};

export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: 'admin' | 'customer';
};
