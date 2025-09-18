
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductForm } from "../_components/ProductForm";
import { firestore } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Category } from "@/lib/types";

export default async function NewProductPage() {
    const categoriesCollection = collection(firestore, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Fill out the form to add a new product to your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <ProductForm categories={categories} />
            </CardContent>
        </Card>
    );
}
