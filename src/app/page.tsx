import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
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
      <section className="relative overflow-hidden bg-gradient-to-b from-red-100/30 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
                    <Image src="https://picsum.photos/seed/hero1/1200/400" alt="Hero 1" fill className="object-cover" data-ai-hint="sale promotion" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white p-4">
                        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                            Digital Deals Galore
                        </h1>
                        <p className="mt-4 max-w-xl text-lg">
                            Get the best prices on your favorite digital subscriptions.
                        </p>
                        <Button asChild size="lg" className="mt-6">
                            <Link href="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </div>
                </div>
              </CarouselItem>
               <CarouselItem>
                <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
                    <Image src="https://picsum.photos/seed/hero2/1200/400" alt="Hero 2" fill className="object-cover" data-ai-hint="new products" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white p-4">
                        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                            Fresh Arrivals
                        </h1>
                        <p className="mt-4 max-w-xl text-lg">
                            Check out the latest additions to our collection.
                        </p>
                        <Button asChild size="lg" className="mt-6">
                            <Link href="/products">Explore <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex left-4 text-white" />
            <CarouselNext className="hidden sm:flex right-4 text-white" />
          </Carousel>
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
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
