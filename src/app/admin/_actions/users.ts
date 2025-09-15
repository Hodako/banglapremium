'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';

const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: { form: 'You must be logged in to update your profile.' }};
  }
  
  const result = updateUserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return { error: result.error.formErrors.fieldErrors };
  }

  const data = result.data;
  const newName = `${data.firstName} ${data.lastName}`;
  
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: newName,
      },
    });

    revalidatePath('/account');
    return { success: 'Profile updated successfully!' };

  } catch (e) {
    return { error: { form: 'An error occurred while updating your profile.' }};
  }
}
