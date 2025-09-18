
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { firestore } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';


const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
});

type FormState = {
  error?: {
    form?: string;
    firstName?: string[];
    lastName?: string[];
  };
  success?: string;
} | null;

export async function updateUserProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: { form: 'You must be logged in to update your profile.' }};
  }
  
  const result = updateUserSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { firstName, lastName } = result.data;
  const newName = `${firstName} ${lastName}`;
  
  try {
    const userRef = doc(firestore, 'users', session.user.id);
    await updateDoc(userRef, {
        name: newName
    });

    revalidatePath('/account');
    return { success: 'Profile updated successfully!' };

  } catch (e) {
    console.error(e);
    return { error: { form: 'An error occurred while updating your profile.' }};
  }
}
