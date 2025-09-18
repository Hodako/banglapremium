
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { firestore } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/types';


const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            const validatedCredentials = z
            .object({ email: z.string().email(), password: z.string() })
            .safeParse(credentials);
            
            if (validatedCredentials.success) {
                const { email, password } = validatedCredentials.data;
                
                const usersRef = collection(firestore, 'users');
                const q = query(usersRef, where('email', '==', email));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    console.log('No user found with this email.');
                    return null;
                }
                
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data() as User & { password?: string };

                // Handle users who signed up with OAuth (no password)
                if (!userData.password) {
                     console.log('User signed up with OAuth, no password.');
                     return null; // Or handle as a specific error case
                }

                const passwordsMatch = await bcrypt.compare(password, userData.password);

                if (passwordsMatch) {
                    const user: User = {
                        id: userDoc.id,
                        name: userData.name,
                        email: userData.email,
                        image: userData.image,
                        role: userData.role,
                    };
                    return user;
                }
            }

            console.log('Invalid credentials provided.');
            return null;
        }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // The user object passed here is from the authorize function or OAuth flow
        token.id = user.id;
        token.role = (user as User).role || 'customer';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // The default user type from next-auth doesn't have id or role
        // so we need to cast it to include our custom properties.
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as 'admin' | 'customer';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login' // Redirect to login page on error, with error in query params
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export default authConfig;
