'use server';

import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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
    console.error(result.error.formErrors.fieldErrors);
    return { error: result.error.formErrors };
  }

  const data = result.data;
  
  await addDoc(collection(firestore, 'products'), {
    name: data.name,
    description: data.description,
    longDescription: data.longDescription || '',
    price: data.price,
    originalPrice: data.originalPrice || null,
    categoryId: data.categoryId,
    imageUrl: data.imageUrl,
    imageHint: data.imageHint || '',
    isFeatured: data.isFeatured || false,
    isBestSelling: data.isBestSelling || false,
    slug: data.name.toLowerCase().replace(/\s+/g, '-'), // simple slug generation
    createdAt: new Date(),
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
  const productRef = doc(firestore, 'products', id);

  await updateDoc(productRef, {
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
  });

  revalidatePath('/admin/products');
  revalidatePath(`/products/${data.name.toLowerCase().replace(/\s+/g, '-')}`);
  redirect('/admin/products');
}


export async function deleteProduct(id: string) {
  await deleteDoc(doc(firestore, 'products', id));
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
}
