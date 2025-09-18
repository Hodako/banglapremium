import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Category } from '@/lib/types';

export async function GET() {
  try {
    const categoriesQuery = query(collection(firestore, 'categories'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(categoriesQuery);
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ message: "Failed to fetch categories", error }, { status: 500 });
  }
}
