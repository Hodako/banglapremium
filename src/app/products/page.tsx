'use client';

import { products, categories } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Metadata } from 'next';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [priceRange, setPriceRange] = useState<[number]>([50]);

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'popularity';
  const page = Number(searchParams.get('page')) || 1;
  const maxPrice = Number(searchParams.get('price')) || 50;

  const handleFilterChange = (type: 'category' | 'sort' | 'price', value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, String(value));
    if (type !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0]]);
  }

  const handlePriceCommit = (value: number[]) => {
    handleFilterChange('price', value[0]);
  }

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (category !== 'all') {
      const selectedCategory = categories.find(c => c.slug === category);
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory.name);
      }
    }
    
    filtered = filtered.filter(p => p.price <= maxPrice);

    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products are in a somewhat chronological order by default
        filtered.reverse();
        break;
      case 'popularity':
      default:
        // A simple popularity sort based on isBestSelling and isFeatured
        filtered.sort((a, b) => (b.isBestSelling ? 1 : 0) - (a.isBestSelling ? 1 : 0) || (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return filtered;
  }, [category, sort, maxPrice]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">All Products</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find the perfect digital service for you.</p>
      </div>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <aside className="md:col-span-1 p-4 border rounded-lg bg-card sticky top-24">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-base">Category</Label>
              <Select value={category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price-range" className="text-base">Max Price: ${priceRange[0]}</Label>
              <Slider
                id="price-range"
                min={0}
                max={50}
                step={1}
                value={priceRange}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceCommit}
                className="mt-2"
              />
            </div>
             <div>
              <Label className="text-base">Sort By</Label>
              <Select value={sort} onValueChange={(value) => handleFilterChange('sort', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        <main className="md:col-span-3">
           {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
           ) : (
             <div className="text-center py-16">
                <h2 className="text-xl font-semibold">No products found</h2>
                <p className="mt-2 text-muted-foreground">Try adjusting your filters.</p>
              </div>
           )}
        </main>
      </div>
    </div>
  );
}
