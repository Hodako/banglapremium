import { NextResponse, type NextRequest } from 'next/server';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where, limit, orderBy, startAt, endAt } from 'firebase/firestore';
import { Category, Product } from '@/lib/types';

const PRODUCTS_PER_PAGE = 8;
const MAX_PRICE = 5000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get('page')) || 1;
  const pageLimit = Number(searchParams.get('limit')) || PRODUCTS_PER_PAGE;
  const categoryId = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'popularity';
  const maxPrice = Number(searchParams.get('price')) || MAX_PRICE;
  const searchQuery = searchParams.get('q');
  const isFeatured = searchParams.get('featured') === 'true';
  const isBestSelling = searchParams.get('best_selling') === 'true';

  try {
    let q = query(collection(firestore, 'products'));

    // Filtering
    if (maxPrice < MAX_PRICE) {
        q = query(q, where('price', '<=', maxPrice));
    }
    if (categoryId !== 'all') {
        q = query(q, where('categoryId', '==', categoryId));
    }
    if (isFeatured) {
        q = query(q, where('isFeatured', '==', true));
    }
    if (isBestSelling) {
        q = query(q, where('isBestSelling', '==', true));
    }
    if (searchQuery) {
      q = query(q, orderBy('name'), startAt(searchQuery), endAt(searchQuery + '\uf8ff'));
    }


    // Sorting
    switch (sort) {
        case 'price-asc':
        q = query(q, orderBy('price', 'asc'));
        break;
        case 'price-desc':
        q = query(q, orderBy('price', 'desc'));
        break;
        case 'newest':
        q = query(q, orderBy('createdAt', 'desc'));
        break;
        case 'popularity':
        default:
        q = query(q, orderBy('isBestSelling', 'desc'), orderBy('isFeatured', 'desc'));
        break;
    }

    const productsSnapshot = await getDocs(q);
    
    const allProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

    // Pagination (manual for now as Firestore cursors are complex)
    const totalProducts = allProducts.length;
    const paginatedProducts = allProducts.slice((page - 1) * pageLimit, page * pageLimit);
    
    // Fetch categories separately
    const categoriesSnapshot = await getDocs(collection(firestore, 'categories'));
    const categories = categoriesSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})) as Category[];

    return NextResponse.json({
        products: paginatedProducts,
        totalProducts,
        categories,
    });
  } catch (error) {
     console.error("Failed to fetch products:", error);
     return NextResponse.json({ message: "Failed to fetch products", error }, { status: 500 });
  }
}
