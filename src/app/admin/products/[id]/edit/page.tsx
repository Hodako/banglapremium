
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductForm } from "../../_components/ProductForm";
import { notFound } from "next/navigation";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Category, Product } from "@/lib/types";

export default async function EditProductPage({ params: { id } }: { params: { id: string } }) {
    const productRef = doc(firestore, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        notFound();
    }
    
    const product = { id: productSnap.id, ...productSnap.data() } as Product;
    
    const categoriesCollection = collection(firestore, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];


    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>Update the details for "{product.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <ProductForm product={product} categories={categories} />
            </CardContent>
        </Card>
    );
}
