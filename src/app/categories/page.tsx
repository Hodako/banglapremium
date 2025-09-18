

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { categories as staticCategories } from '@/lib/data';


export const metadata: Metadata = {
  title: 'Categories | Bangla Premium',
  description: 'Explore products by category.',
};

export default async function CategoriesPage() {
  // Using static data as a placeholder until Firestore is integrated for products/categories
  const categories = staticCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">Product Categories</h1>
        <p className="mt-2 text-lg text-muted-foreground">Browse our subscriptions by category.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Link key={index} href={`/categories/${category.slug}`} className="group block">
            <Card className="h-full overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="relative h-40 w-full">
                <Image
                  src={category.imageUrl!}
                  alt={category.name}
                  fill
                  className="object-cover"
                  data-ai-hint={category.imageHint!}
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category.name}
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
