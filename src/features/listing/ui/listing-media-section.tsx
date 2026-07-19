import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { ListingImageUploader } from "@/src/features/listing/ui/listing-image-uploader";

export function ListingMediaSection({
  state,
  variant,
}: {
  state: ListingFormState;
  variant: "create" | "edit";
}) {
  const {
    existingMedia,
    handleDeleteExistingMedia,
    handleReorderExistingMedia,
    handleSetMainExistingMedia,
    imageFiles,
    isFormBusy,
    setImageFiles,
  } = state;
  const uploader = (
    <ListingImageUploader
      existingMedia={existingMedia}
      files={imageFiles}
      isDisabled={isFormBusy}
      onChange={setImageFiles}
      onDeleteExisting={handleDeleteExistingMedia}
      onReorderExisting={handleReorderExistingMedia}
      onSetMainExisting={handleSetMainExistingMedia}
    />
  );

  if (variant === "edit") {
    return uploader;
  }

  return (
    <section className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
      <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Фотографии</p>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
        Добавьте фотографии товара. Чем больше фото — тем выше шанс быстрой продажи.
      </p>
      <div className="mt-5">{uploader}</div>
    </section>
  );
}
