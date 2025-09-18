
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryForm } from "../_components/CategoryForm";

export default function NewCategoryPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Fill out the form to add a new category to your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <CategoryForm />
            </CardContent>
        </Card>
    );
}
