'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  originalPrice: z.coerce.number().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  imageHint: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isBestSelling: z.coerce.boolean().optional(),
});

export async function addProduct(formData: FormData) {
  const result = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    // This is a simple error handling. In a real app, you'd want to
    // return the errors to the form to display them to the user.
    console.error(result.error.formErrors.fieldErrors);
    return { error: result.error.formErrors };
  }

  const data = result.data;

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription,
      price: data.price,
      originalPrice: data.originalPrice,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
      isFeatured: data.isFeatured || false,
      isBestSelling: data.isBestSelling || false,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'), // simple slug generation
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const result = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return { error: result.error.formErrors };
  }
    
  const data = result.data;
  const product = await prisma.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription,
      price: data.price,
      originalPrice: data.originalPrice,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
      isFeatured: data.isFeatured || false,
      isBestSelling: data.isBestSelling || false,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
    },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/products/${product.slug}`);
  redirect('/admin/products');
}


export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({ where: { id } });
  if (product == null) return notFound();

  revalidatePath('/admin/products');
  revalidatePath('/products');
}
