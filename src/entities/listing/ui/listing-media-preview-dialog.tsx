"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";
import { MediaImage } from "@/src/shared/ui/media-image";
import { ListingMediaPlaceholder } from "./listing-media-placeholder";

type ListingMediaPreviewDialogProps = {
  activeImage: string;
  activeIndex: number;
  hasMultipleImages: boolean;
  isOpen: boolean;
  onNextAction: () => void;
  onOpenChangeAction: (isOpen: boolean) => void;
  onPreviousAction: () => void;
  title: string;
};

export function ListingMediaPreviewDialog({
  activeImage,
  activeIndex,
  hasMultipleImages,
  isOpen,
  onNextAction,
  onOpenChangeAction,
  onPreviousAction,
  title,
}: ListingMediaPreviewDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChangeAction} open={isOpen}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[1200px] border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="relative h-[min(82vh,760px)] w-full">
          {activeImage ? (
            <MediaImage
              alt={`${title}. Фото ${activeIndex + 1}`}
              className="object-contain"
              fill
              sizes="min(1200px, 100vw)"
              src={activeImage}
            />
          ) : (
            <ListingMediaPlaceholder />
          )}

          {hasMultipleImages ? (
            <>
              <button
                aria-label="Предыдущее изображение"
                className="absolute left-2 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-deep)_62%,transparent)] text-white shadow-[var(--shadow-card)] transition hover:bg-[var(--brand-deep)] sm:left-4"
                onClick={onPreviousAction}
                type="button"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                aria-label="Следующее изображение"
                className="absolute right-2 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-deep)_62%,transparent)] text-white shadow-[var(--shadow-card)] transition hover:bg-[var(--brand-deep)] sm:right-4"
                onClick={onNextAction}
                type="button"
              >
                <ChevronRight size={22} />
              </button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
