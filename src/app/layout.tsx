
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/context/cart-context';
import { OfferBanner } from '@/components/offer-banner';
import { Noto_Sans } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const noto = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-noto-sans',
});


export const metadata: Metadata = {
  title: 'Bangla Premium',
  description: 'Your one-stop shop for digital subscriptions and services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-body antialiased', noto.variable)} suppressHydrationWarning={true}>
        <SessionProvider>
          <CartProvider>
            <div className="relative flex min-h-dvh flex-col">
              <OfferBanner />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
