
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Category } from "@/lib/types";
import Image from "next/image";
import { CLOUDFLARE_IMAGE_DELIVERY_URL } from "@/lib/constants";
import { DeleteCategoryButton } from "./_components/DeleteCategoryButton";


export default async function AdminCategoriesPage() {
  const categoriesQuery = query(collection(firestore, "categories"), orderBy('name', 'asc'));
  const categoriesSnapshot = await getDocs(categoriesQuery);
  const allCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your product categories.</CardDescription>
          </div>
          <Button size="sm" className="gap-1" asChild>
            <Link href="/admin/categories/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Category
                </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                Image
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCategories.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No categories found.
                    </TableCell>
                </TableRow>
            ) : allCategories.map(category => (
                 <TableRow key={category.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                            alt={category.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={`${CLOUDFLARE_IMAGE_DELIVERY_URL}/${category.imageUrl}/thumbnail`}
                            width="64"
                        />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="hidden md:table-cell">{category.description}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                 <DropdownMenuItem asChild>
                                    <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                <DeleteCategoryButton id={category.id} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

