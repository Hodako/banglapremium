
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "react-dom"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// These types are placeholders until we define the Firestore schema
type Product = any; 
type Category = any;

// The actions are disabled as they were tied to Prisma
const noOpAction = async () => ({ error: { form: "Database not connected. This is a placeholder." }});

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null
  categories: Category[]
}) {
  const [error, action] = useFormState(noOpAction, {});
  const [price, setPrice] = useState<number | undefined>(product?.price ? Number(product.price) : undefined);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(product?.originalPrice ? Number(product.originalPrice) : undefined);

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error?.name && <div className="text-destructive text-sm">{error.name}</div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="price">Price (in BDT)</Label>
            <Input
            type="number"
            id="price"
            name="price"
            required
            value={price}
            onChange={e => setPrice(Number(e.target.value) || undefined)}
            />
             {error?.price && <div className="text-destructive text-sm">{error.price}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price (Optional)</Label>
            <Input
            type="number"
            id="originalPrice"
            name="originalPrice"
            value={originalPrice}
            onChange={e => setOriginalPrice(Number(e.target.value) || undefined)}
            />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select name="categoryId" defaultValue={product?.categoryId}>
            <SelectTrigger>
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        {error?.categoryId && <div className="text-destructive text-sm">{error.categoryId}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error?.description && <div className="text-destructive text-sm">{error.description}</div>}
      </div>
       <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          name="longDescription"
          defaultValue={product?.longDescription || ""}
          rows={5}
        />
      </div>
       <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="text"
          id="imageUrl"
          name="imageUrl"
          required
          defaultValue={product?.imageUrl || ""}
        />
         {error?.imageUrl && <div className="text-destructive text-sm">{error.imageUrl}</div>}
      </div>
       <div className="space-y-2">
        <Label htmlFor="imageHint">Image AI Hint</Label>
        <Input
          type="text"
          id="imageHint"
          name="imageHint"
          defaultValue={product?.imageHint || ""}
        />
      </div>
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
            <Checkbox id="isFeatured" name="isFeatured" defaultChecked={product?.isFeatured || false} />
            <Label htmlFor="isFeatured">Featured</Label>
        </div>
         <div className="flex items-center gap-2">
            <Checkbox id="isBestSelling" name="isBestSelling" defaultChecked={product?.isBestSelling || false}/>
            <Label htmlFor="isBestSelling">Best Selling</Label>
        </div>
      </div>

      <Button type="submit" disabled>{product == null ? "Add Product" : "Update Product"}</Button>
       {error?.form && <div className="text-destructive text-sm mt-2">{error.form}</div>}
    </form>
  )
}
