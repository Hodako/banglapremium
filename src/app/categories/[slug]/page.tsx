import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import type { Metadata } from 'next';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Product, Category } from '@/lib/types';

const CLOUDFLARE_IMAGE_DELIVERY_URL = `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}`

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoriesQuery = query(collection(firestore, "categories"), where("slug", "==", params.slug));
  const querySnapshot = await getDocs(categoriesQuery);
  
  if (querySnapshot.empty) {
    return { title: 'Category not found' };
  }
  
  const category = querySnapshot.docs[0].data() as Category;

  return {
    title: `${category.name} | Bangla Premium`,
    description: `Browse products in the ${category.name} category.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoriesQuery = query(collection(firestore, "categories"), where("slug", "==", params.slug));
  const categorySnapshot = await getDocs(categoriesQuery);

  if (categorySnapshot.empty) {
    notFound();
  }

  const category = {id: categorySnapshot.docs[0].id, ...categorySnapshot.docs[0].data()} as Category;

  const productsQuery = query(collection(firestore, 'products'), where('categoryId', '==', category.id));
  const productsSnapshot = await getDocs(productsQuery);
  const categoryProducts = productsSnapshot.docs.map(doc => {
      const data = doc.data() as Product
      return {
        ...data,
        id: doc.id,
        imageUrl: `${CLOUDFLARE_IMAGE_DELIVERY_URL}/${data.imageUrl}/public`
      }
  }) as Product[];

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
  const categoriesSnapshot = await getDocs(collection(firestore, 'categories'));
  const categories = categoriesSnapshot.docs.map(doc => doc.data() as Category);
  
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
