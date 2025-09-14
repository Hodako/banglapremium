import { ReactNode } from "react";

export const metadata = {
  title: 'All Products | Bangla Premium',
  description: 'Browse all available digital products and subscriptions.',
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
