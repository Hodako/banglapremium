

import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/db';

const PRODUCTS_PER_PAGE = 8;
const MAX_PRICE = 5000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || PRODUCTS_PER_PAGE;
  const categorySlug = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'popularity';
  const maxPrice = Number(searchParams.get('price')) || MAX_PRICE;
  const query = searchParams.get('q');

  const whereClause: any = {
    price: {
      lte: maxPrice,
    },
  };

  if (categorySlug !== 'all') {
    whereClause.category = {
      slug: categorySlug,
    };
  }

  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { category: { name: { contains: query, mode: 'insensitive' } } },
    ];
  }

  let orderBy: any;
  switch (sort) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
      orderBy = { releaseDate: 'desc' };
      break;
    case 'popularity':
    default:
      orderBy = [
        { isBestSelling: 'desc' },
        { isFeatured: 'desc' },
        { name: 'asc' },
      ];
      break;
  }
  
  try {
    const [products, totalProducts, categories] = await prisma.$transaction([
        prisma.product.findMany({
            where: whereClause,
            orderBy: orderBy,
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.product.count({ where: whereClause }),
        prisma.category.findMany(),
    ]);

    return NextResponse.json({
        products,
        totalProducts,
        categories,
    });
  } catch (error) {
     console.error("Failed to fetch products:", error);
     return NextResponse.json({ message: "Failed to fetch products", error }, { status: 500 });
  }
}

    