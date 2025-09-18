
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryForm } from "../../_components/CategoryForm";
import { notFound } from "next/navigation";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Category } from "@/lib/types";

export default async function EditCategoryPage({ params: { id } }: { params: { id: string } }) {
    const categoryRef = doc(firestore, 'categories', id);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
        notFound();
    }
    
    const category = { id: categorySnap.id, ...categorySnap.data() } as Category;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Category</CardTitle>
                <CardDescription>Update the details for "{category.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <CategoryForm category={category} />
            </CardContent>
        </Card>
    );
}

