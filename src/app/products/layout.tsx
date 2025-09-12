import { ReactNode } from "react";

export const metadata = {
  title: 'All Products | Digital Direct',
  description: 'Browse all available digital products and subscriptions.',
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
