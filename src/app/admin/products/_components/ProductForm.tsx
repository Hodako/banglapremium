'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "react-dom"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { addProduct, updateProduct } from "@/app/admin/_actions/products"
import { Product, Category } from "@/lib/types"
import { uploadImage } from "@/app/admin/_actions/cloudflare"
import Image from "next/image"

const CLOUDFLARE_IMAGE_DELIVERY_URL = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}`

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null
  categories: Category[]
}) {
  const [error, action] = useFormState(product ? updateProduct.bind(null, product.id) : addProduct, {});
  const [price, setPrice] = useState<number | undefined>(product?.price ? Number(product.price) : undefined);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(product?.originalPrice ? Number(product.originalPrice) : undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(product?.imageUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const result = await uploadImage(formData);
      if (result.success && result.imageId) {
        setImageUrl(result.imageId);
      } else {
        // Handle upload error, maybe show a toast
        console.error(result.error);
      }
      setIsUploading(false);
    }
  }


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
        <Label htmlFor="image">Product Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
         {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
         {imageUrl && (
            <div className="mt-4 relative w-48 h-48">
              <Image 
                src={`${CLOUDFLARE_IMAGE_DELIVERY_URL}/${imageUrl}/public`} 
                alt="Product image preview" 
                fill
                className="rounded-md object-cover"
              />
            </div>
         )}
        <input type="hidden" name="imageUrl" value={imageUrl} />
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

      <Button type="submit">{product == null ? "Add Product" : "Update Product"}</Button>
       {error?.form && <div className="text-destructive text-sm mt-2">{error.form}</div>}
    </form>
  )
}
