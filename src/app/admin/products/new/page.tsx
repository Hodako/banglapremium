import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductForm } from "../_components/ProductForm";
import prisma from "@/lib/db";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany();
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
