
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirebaseAdapter } from "@next-auth/firebase-adapter"
import { firestore } from '@/lib/firebase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: FirebaseAdapter(firestore),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // This is a simplified role assignment. 
        // In a real app, you might query Firestore to get a custom role.
        const isAdmin = user.email === 'admin@example.com';
        token.role = isAdmin ? 'admin' : 'customer';
        token.id = user.id;
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};
