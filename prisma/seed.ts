import { PrismaClient } from '@prisma/client'
import { products, categories } from '../src/lib/data'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared previous data.');

  // Seed Admin User
  console.log('Seeding admin user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  });
  console.log('Admin user created.');

  // Seed Categories
  console.log('Seeding categories...');
  for (const category of categories) {
    await prisma.category.create({
      data: {
        // id: category.id, // Let Prisma handle ID generation
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        imageHint: category.imageHint,
      },
    })
  }
  console.log('Categories seeded.');

  // Seed Products
  console.log('Seeding products...');
  for (const product of products) {
     const categoryInDb = await prisma.category.findUnique({
         where: { name: product.category }
     });

     if (categoryInDb) {
        await prisma.product.create({
            data: {
                // id: product.id, // Let Prisma handle ID generation
                name: product.name,
                slug: product.slug,
                description: product.description,
                longDescription: product.longDescription,
                price: product.price,
                originalPrice: product.originalPrice,
                imageUrl: product.imageUrl,
                imageHint: product.imageHint,
                categoryId: categoryInDb.id,
                isFeatured: product.isFeatured,
                isBestSelling: product.isBestSelling,
                releaseDate: product.releaseDate ? new Date(product.releaseDate) : null,
            },
        });
     }
  }
  console.log('Products seeded.');

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
