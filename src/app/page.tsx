
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { ArrowRight, Star, Tag, Gift, LayoutGrid } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getHomePageData() {
      setIsLoading(true);
      try {
        const [featuredRes, bestSellersRes, categoriesRes] = await Promise.all([
          fetch('/api/products?sort=popularity&limit=10&featured=true'),
          fetch('/api/products?sort=popularity&limit=5&best_selling=true'),
          fetch('/api/products/categories'),
        ]);

        if (!featuredRes.ok || !bestSellersRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch homepage data');
        }
        
        const featuredData = await featuredRes.json();
        const bestSellersData = await bestSellersRes.json();
        const categoriesData = await categoriesRes.json();

        setFeaturedProducts(featuredData.products);
        setBestSellingProducts(bestSellersData.products);
        setTopCategories(categoriesData.slice(0, 4));

      } catch (error) {
        console.error('Failed to fetch homepage data', error);
      } finally {
        setIsLoading(false);
      }
    }
    getHomePageData();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-red-100/30 to-background pt-2 pb-0">
        <div className="container mx-auto px-4">
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-64">
                  <Image
                    src="https://picsum.photos/seed/hero1/1200/400"
                    alt="Hero 1"
                    fill
                    className="object-cover"
                    data-ai-hint="sale promotion"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center text-white">
                    <h1 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                      Digital Deals Galore
                    </h1>
                    <p className="mt-4 max-w-xl text-lg">
                      Get the best prices on your favorite digital subscriptions.
                    </p>
                    <Button asChild size="lg" className="mt-6">
                      <Link href="/products">
                        Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-64">
                  <Image
                    src="https://picsum.photos/seed/hero2/1200/400"
                    alt="Hero 2"
                    fill
                    className="object-cover"
                    data-ai-hint="new products"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center text-white">
                    <h1 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                      Fresh Arrivals
                    </h1>
                    <p className="mt-4 max-w-xl text-lg">
                      Check out the latest additions to our collection.
                    </p>
                    <Button asChild size="lg" className="mt-6">
                      <Link href="/products">
                        Explore <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4 hidden bg-black/20 text-white hover:bg-black/50 sm:flex border-none" />
            <CarouselNext className="right-4 hidden bg-black/20 text-white hover:bg-black/50 sm:flex border-none" />
          </Carousel>
        </div>
      </section>

      <section className="pt-4 pb-8 md:pt-6 md:pb-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
              <Tag className="h-6 w-6 text-primary" />
              Featured Products
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="flex space-x-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-1/5" />
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {featuredProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          )}
        </div>
      </section>

      <section className="bg-muted/30 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
              <Star className="h-6 w-6 text-primary" />
              Best Sellers
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/best-sellers">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {bestSellingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
              <Gift className="h-6 w-6 text-primary" />
              Just for You
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="group relative overflow-hidden">
              <Link href="/products?category=gaming">
                <Image
                  src="https://picsum.photos/seed/offer1/800/400"
                  alt="Special Offer 1"
                  width={800}
                  height={400}
                  className="h-auto w-full object-cover transition-transform group-hover:scale-105"
                  data-ai-hint="electronics sale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white">
                    Gaming Subscriptions
                  </h3>
                  <p className="mb-4 text-white/90">
                    Up to 30% off on premium gaming services.
                  </p>
                  <Button>Buy Now</Button>
                </div>
              </Link>
            </Card>
            <Card className="group relative overflow-hidden">
              <Link href="/products?category=entertainment">
                <Image
                  src="https://picsum.photos/seed/offer2/800/400"
                  alt="Special Offer 2"
                  width={800}
                  height={400}
                  className="h-auto w-full object-cover transition-transform group-hover:scale-105"
                  data-ai-hint="streaming service"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white">
                    Movie & TV Streaming
                  </h3>
                  <p className="mb-4 text-white/90">
                    Get your first 3 months for just $1.
                  </p>
                  <Button>Buy Now</Button>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
              <LayoutGrid className="h-6 w-6 text-primary" />
              Top Categories
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block"
                >
                  <Card className="h-full overflow-hidden transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
                    <div className="relative h-40 w-full">
                      <Image
                        src={category.imageUrl!}
                        alt={category.name}
                        fill
                        className="object-cover"
                        data-ai-hint={category.imageHint}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {category.name}
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
