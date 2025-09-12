import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { ProductRecommendations } from '@/components/product-recommendations';
import { ArrowRight, Star, Tag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured);
  const bestSellingProducts = products.filter(p => p.isBestSelling);

  return (
    <div>
      <section className="relative overflow-hidden bg-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Digital Subscriptions, Simplified.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Instantly access premium digital services. One platform, all your subscriptions, hassle-free.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/products">
                Explore Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl font-headline">
              <Tag className="h-6 w-6 text-primary" />
              Featured Products
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/products">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl font-headline">
              <Star className="h-6 w-6 text-primary" />
              Best Sellers
            </h2>
             <Button variant="ghost" asChild>
              <Link href="/products">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      <ProductRecommendations />
    </div>
  );
}
