'use server'

type UploadResult = {
    success: boolean;
    imageId?: string;
    error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const image = formData.get('image') as File;
  if (!image) {
    return { success: false, error: 'No image file found.' };
  }

  const uploadFormData = new FormData();
  uploadFormData.append('file', image);

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudflare API Error:', errorData);
        return { success: false, error: `Failed to upload image: ${errorData.errors[0]?.message || response.statusText}` };
    }

    const data = await response.json();

    if (data.success && data.result.id) {
      return { success: true, imageId: data.result.id };
    } else {
      return { success: false, error: 'Cloudflare upload was not successful.' };
    }
  } catch (error) {
    console.error('Error uploading to Cloudflare:', error);
    return { success: false, error: 'An unexpected error occurred during image upload.' };
  }
}
