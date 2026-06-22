import { ChevronRight, Save } from "lucide-react";
import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import { ListingSubmitActions } from "@/src/features/listing/ui/listing-submit-actions";

export function ListingSubmitBar({
  state,
  variant,
}: {
  state: ListingFormState;
  variant: "create" | "edit";
}) {
  const {
    isFormBusy,
    isSubmitting,
    isUploadingMedia,
    mediaRetryListingId,
    retryMediaUpload,
    submitForm,
  } = state;

  if (variant === "edit") {
    return (
      <ListingSubmitActions
        isDisabled={isFormBusy}
        isSubmitting={isSubmitting}
        isUploadingMedia={isUploadingMedia}
        mediaRetryListingId={mediaRetryListingId}
        mode="edit"
        onRetryMediaUploadAction={retryMediaUpload}
        onSubmitAction={submitForm}
      />
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <div className="grid w-full max-w-[560px] gap-3 sm:grid-cols-2">
          <button
            aria-label="Сохранить как черновик"
            className="inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--brand-deep)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
            disabled={isFormBusy}
            onClick={() => submitForm(true)}
            type="button"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--brand-deep)]">
              <Save size={16} />
            </span>
            <span>Сохранить</span>
          </button>

          <button
            aria-label="Отправить на проверку"
            className="inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,var(--accent),color-mix(in_srgb,var(--accent)_78%,var(--brand)))] px-4 text-sm font-semibold text-[var(--active-button-text)] shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60"
            disabled={isFormBusy}
            onClick={() => submitForm(false)}
            type="button"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-white/12">
              <ChevronRight size={16} />
            </span>
            <span>Отправить на проверку</span>
          </button>
        </div>
      </div>

      {mediaRetryListingId !== null ? (
        <div className="rounded-[24px] border border-[var(--danger-soft)] bg-[var(--danger-soft)] p-4">
          <ListingSubmitActions
            isDisabled={isFormBusy}
            isSubmitting={isSubmitting}
            isUploadingMedia={isUploadingMedia}
            mediaRetryListingId={mediaRetryListingId}
            mode="create"
            onRetryMediaUploadAction={retryMediaUpload}
            onSubmitAction={submitForm}
          />
        </div>
      ) : null}
    </>
  );
}
