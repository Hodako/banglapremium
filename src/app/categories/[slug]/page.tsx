import { products, categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    return {
      title: 'Category not found',
    };
  }

  return {
    title: `${category.name} | Digital Direct`,
    description: `Browse products in the ${category.name} category.`,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category === category.name);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">{category.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{category.description}</p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-muted-foreground">There are currently no products in this category.</p>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
