import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductForm } from "../../_components/ProductForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params: { id } }: { params: { id: string } }) {
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({ where: { id } }),
        prisma.category.findMany()
    ]);

    if (!product) return notFound();

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
