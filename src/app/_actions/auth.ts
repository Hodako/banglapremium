'use server';

import { z } from 'zod';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc }slurp
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

const SignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function signup(prevState: unknown, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { error: { form: 'An account with this email already exists.' } };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`;

    // Create user in Firestore
    await addDoc(usersRef, {
      name,
      email,
      password: hashedPassword,
      role: 'customer', // Default role
      createdAt: new Date(),
    });

    return { success: 'Account created successfully! You can now log in.' };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: { form: 'An unexpected error occurred. Please try again.' } };
  }
}

// This is a placeholder for a login server action if we choose to implement
// a fully custom login flow outside of next-auth's server-side handling.
// For now, next-auth handles the credential authorization directly.
export async function login(email: string, password: string) {
  try {
    // In a real scenario, you might have more complex logic here
    // But for now, we let the CredentialsProvider in auth.config.ts handle it.
    console.log('Attempting login for:', email);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
