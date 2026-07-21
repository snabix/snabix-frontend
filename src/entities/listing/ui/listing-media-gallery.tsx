"use client";

import { useState } from "react";
import { normalizeListingImages } from "@/src/entities/listing/lib/listing-media";
import { ListingMediaCardGallery } from "./listing-media-card-gallery";
import { ListingMediaDetailsGallery } from "./listing-media-details-gallery";
export { normalizeListingImages } from "@/src/entities/listing/lib/listing-media";
export { ListingMediaUploadGrid } from "./listing-media-upload-grid";

type ListingMediaGalleryProps = {
  detailsHref?: string;
  imageUrl?: string | null;
  imageUrls?: string[];
  mode?: "card" | "details";
  title: string;
};

export function ListingMediaGallery({
  detailsHref,
  imageUrl,
  imageUrls,
  mode = "card",
  title,
}: ListingMediaGalleryProps) {
  const images = normalizeListingImages(imageUrl, imageUrls);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const activeImage = images[activeIndex] ?? images[0] ?? "";
  const hasMultipleImages = images.length > 1;
  const hasRealImages = images.some(Boolean);
  const previewImages = images.length > 4 ? images.slice(0, 5) : images;
  const hiddenImagesCount = Math.max(images.length - 4, 0);

  const openPreview = (index: number) => {
    if (!hasRealImages) {
      return;
    }

    setActiveIndex(index);
    setIsPreviewOpen(true);
  };

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) => (
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    ));
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) => (
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    ));
  };

  if (mode === "details") {
    return (
      <ListingMediaDetailsGallery
        activeImage={activeImage}
        activeIndex={activeIndex}
        hasMultipleImages={hasMultipleImages}
        hasRealImages={hasRealImages}
        hiddenImagesCount={hiddenImagesCount}
        images={images}
        isPreviewOpen={isPreviewOpen}
        onActiveIndexChange={setActiveIndex}
        onNext={showNextImage}
        onOpenPreview={openPreview}
        onPreviewOpenChange={setIsPreviewOpen}
        onPrevious={showPreviousImage}
        previewImages={previewImages}
        title={title}
      />
    );
  }

  return (
    <ListingMediaCardGallery
      activeImage={activeImage}
      activeIndex={activeIndex}
      detailsHref={detailsHref}
      hasMultipleImages={hasMultipleImages}
      images={images}
      onActiveIndexChange={setActiveIndex}
      title={title}
    />
  );
}
