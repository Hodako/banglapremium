
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ListFilter, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';


const PRODUCTS_PER_PAGE = 8;

function Filters({ isMobile, closeSheet }: { isMobile: boolean, closeSheet?: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [priceRange, setPriceRange] = useState<[number]>([Number(searchParams.get('price')) || 50]);
  const [currentCategory, setCurrentCategory] = useState(searchParams.get('category') || 'all');
  const [currentSort, setCurrentSort] = useState(searchParams.get('sort') || 'popularity');

  const handleFilterChange = (type: 'category' | 'sort' | 'price', value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, String(value));
    if (type !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
    if (isMobile && closeSheet) {
      closeSheet();
    }
  };

  const handlePriceCommit = (value: number[]) => {
    setPriceRange([value[0]]);
    handleFilterChange('price', value[0]);
  }
  
  const resetFilters = () => {
    setPriceRange([50]);
    setCurrentCategory('all');
    setCurrentSort('popularity');
    router.push(pathname);
    if (isMobile && closeSheet) {
        closeSheet();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
      </div>
      <div>
        <Label className="text-base">Category</Label>
        <Select value={currentCategory} onValueChange={(value) => { setCurrentCategory(value); handleFilterChange('category', value)}}>
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
          onValueChange={setPriceRange}
          onValueCommit={handlePriceCommit}
          className="mt-2"
        />
      </div>
       <div>
        <Label className="text-base">Sort By</Label>
        <Select value={currentSort} onValueChange={(value) => { setCurrentSort(value); handleFilterChange('sort', value)}}>
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
  )
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'popularity';
  const page = Number(searchParams.get('page')) || 1;
  const maxPrice = Number(searchParams.get('price')) || 50;


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
  
  const FilterComponent = isMobile ? (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <ListFilter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Filters isMobile={true} closeSheet={() => setSheetOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
      <aside className="md:col-span-1 p-4 border rounded-lg bg-card sticky top-24">
        <Filters isMobile={false}/>
      </aside>
  );


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">All Products</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find the perfect digital service for you.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {isMobile && <div className="md:hidden">{FilterComponent}</div>}
        {!isMobile && FilterComponent}

        <main className="md:col-span-3">
           {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
             <div className="text-center py-16 col-span-3">
                <h2 className="text-xl font-semibold">No products found</h2>
                <p className="mt-2 text-muted-foreground">Try adjusting your filters.</p>
              </div>
           )}
        </main>
      </div>
    </div>
  );
}
