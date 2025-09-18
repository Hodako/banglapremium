'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "react-dom"
import { Textarea } from "@/components/ui/textarea"
import { addCategory, updateCategory } from "@/app/admin/_actions/categories"
import { Category } from "@/lib/types"
import { uploadImage } from "@/app/admin/_actions/cloudflare"
import Image from "next/image"
import { useFormStatus } from "react-dom"

const CLOUDFLARE_IMAGE_DELIVERY_URL = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}`

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Category' : 'Add Category')}
        </Button>
    )
}

export function CategoryForm({
  category
}: {
  category?: Category | null
}) {
  const [error, action] = useFormState(category ? updateCategory.bind(null, category.id) : addCategory, {});
  const [imageUrl, setImageUrl] = useState<string | undefined>(category?.imageUrl);
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
          defaultValue={category?.name || ""}
        />
        {error?.name && <div className="text-destructive text-sm">{error.name}</div>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description || ""}
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor="image">Category Image</Label>
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
                alt="Category image preview" 
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
          defaultValue={category?.imageHint || ""}
        />
      </div>
     
      <SubmitButton isEditMode={!!category} />
      {error?.form && <div className="text-destructive text-sm mt-2">{error.form}</div>}
    </form>
  )
}
