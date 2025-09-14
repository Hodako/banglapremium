import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

/**
 * @api {get} /api/products Get All Products
 * @apiName GetProducts
 * @apiGroup Products
 *
 * @apiSuccess {Object[]} products List of products.
 * @apiSuccess {String} products.id Product ID.
 * @apiSuccess {String} products.name Product name.
 * @apiSuccess {String} products.description Product short description.
 * @apiSuccess {Number} products.price Product price.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "prod_001",
 *         "name": "YouTube Premium",
 *         "price": 1200,
 *         ...
 *       }
 *     ]
 */
export async function GET() {
  // In a real application, you would fetch this from your database
  // Example: const allProducts = await db.select().from(productsTable);
  return NextResponse.json(products);
}
