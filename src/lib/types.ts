export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  imageHint: string;
  category: string;
  isFeatured: boolean;
  isBestSelling: boolean;
  releaseDate?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  recipientEmail?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  transactionId: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Processing' | 'Delivered';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    createdAt: string;
}
