'use client';

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
  SheetClose
} from "@/components/ui/sheet";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ListFilter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_PER_PAGE = 8;
const MAX_PRICE = 5000;


function Filters({ categories, isMobile, closeSheet }: { categories: Category[], isMobile: boolean, closeSheet?: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [priceRange, setPriceRange] = useState<[number]>([Number(searchParams.get('price')) || MAX_PRICE]);
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      // Reset page to 1 on filter change
      if (name !== 'page') {
        params.set('page', '1');
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (type: 'category' | 'sort' | 'price', value: string | number) => {
    router.push(`${pathname}?${createQueryString(type, String(value))}`);
    if (isMobile && closeSheet) {
      closeSheet();
    }
  };

  const handlePriceCommit = (value: number[]) => {
    handleFilterChange('price', value[0]);
  }
  
  const resetFilters = () => {
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
        <Select 
          value={searchParams.get('category') || 'all'} 
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="price-range" className="text-base">Max Price: ৳{priceRange[0]}</Label>
        <Slider
          id="price-range"
          min={0}
          max={MAX_PRICE}
          step={100}
          value={priceRange}
          onValueChange={(value) => setPriceRange([value[0]])}
          onValueCommit={handlePriceCommit}
          className="mt-2"
        />
      </div>
       <div>
        <Label className="text-base">Sort By</Label>
        <Select 
          value={searchParams.get('sort') || 'popularity'} 
          onValueChange={(value) => handleFilterChange('sort', value)}
        >
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

function ProductGrid({ products, isLoading }: { products: Product[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="text-center py-16 col-span-full">
        <h2 className="text-xl font-semibold">No products found</h2>
        <p className="mt-2 text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }
  return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
  );
}


export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      try {
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products);
        setCategories(data.categories);
        setTotalProducts(data.totalProducts);
      } catch (error) {
        console.error("Failed to fetch product data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, [searchParams]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo(0, 0);
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
           <SheetClose />
        </SheetHeader>
        <div className="py-4">
          <Filters categories={categories} isMobile={true} closeSheet={() => setSheetOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
      <aside className="md:col-span-1 p-4 border rounded-lg bg-card sticky top-24 h-fit">
        <Filters categories={categories} isMobile={false}/>
      </aside>
  );


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">All Products</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find the perfect digital service for you.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {isMobile && <div className="md:hidden">{FilterComponent}</div>}
        {!isMobile && FilterComponent}

        <main className="md:col-span-3">
          <ProductGrid products={products} isLoading={isLoading} />
           {totalPages > 1 && !isLoading && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
