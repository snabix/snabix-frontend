export function normalizeListingImages(imageUrl?: string | null, imageUrls?: string[]): string[] {
  const uniqueImages = new Set<string>();

  if (imageUrl) {
    uniqueImages.add(imageUrl);
  }

  imageUrls?.forEach((url) => {
    if (url) {
      uniqueImages.add(url);
    }
  });

  const images = Array.from(uniqueImages);

  return images.length > 0 ? images : [""];
}
