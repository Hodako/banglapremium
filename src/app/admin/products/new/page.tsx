
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductForm } from "../_components/ProductForm";

export default async function NewProductPage() {
    const categories = []; // Categories will be fetched from Firestore later
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
