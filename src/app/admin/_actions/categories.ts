
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  imageHint: z.string().optional(),
});

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function addCategory(prevState: unknown, formData: FormData) {
  const result = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    console.error(result.error.formErrors.fieldErrors);
    return { error: result.error.formErrors };
  }

  const data = result.data;
  
  await addDoc(collection(firestore, 'categories'), {
    name: data.name,
    description: data.description || '',
    imageUrl: data.imageUrl,
    imageHint: data.imageHint || '',
    slug: generateSlug(data.name),
  });

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  redirect('/admin/categories');
}

export async function updateCategory(id: string, prevState: unknown, formData: FormData) {
  const result = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return { error: result.error.formErrors };
  }
    
  const data = result.data;
  const categoryRef = doc(firestore, 'categories', id);

  await updateDoc(categoryRef, {
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl,
    imageHint: data.imageHint,
    slug: generateSlug(data.name),
  });

  revalidatePath('/admin/categories');
  revalidatePath(`/categories/${generateSlug(data.name)}`);
  redirect('/admin/categories');
}


export async function deleteCategory(id: string) {
  // TODO: Check if any products are using this category before deleting.
  await deleteDoc(doc(firestore, 'categories', id));
  
  revalidatePath('/admin/categories');
  revalidatePath('/categories');
}
