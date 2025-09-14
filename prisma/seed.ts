import { PrismaClient } from '@prisma/client'
import { products, categories } from '../src/lib/data'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Seed Admin User
  console.log('Seeding admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      // In a real app, you'd use a hashed password.
      // This is just for the mock setup.
      // For this example, password is not stored in the user model.
      role: 'admin',
    },
  });

  // Seed Categories
  console.log('Seeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        imageHint: category.imageHint,
      },
    })
  }

  // Seed Products
  console.log('Seeding products...');
  for (const product of products) {
     const categoryInDb = await prisma.category.findFirst({
         where: { name: product.category }
     });

     if (categoryInDb) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: {
                id: product.id,
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

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
