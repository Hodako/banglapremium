
import type { NextAuthOptions } from 'next-auth';
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { firestore } from '@/lib/firebase';
import authConfig from '@/lib/auth.config';

export const authOptions: NextAuthOptions = {
  ...authConfig,
  adapter: FirestoreAdapter(firestore),
};

