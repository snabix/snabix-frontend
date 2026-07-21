import { Button } from "@/src/shared/ui/shadcn/button";
import { Spinner } from "@/src/shared/ui/shadcn/spinner";

type ListingSubmitActionsProps = {
  isDisabled: boolean;
  isSubmitting: boolean;
  isUploadingMedia: boolean;
  mediaRetryListingId: string | null;
  mode: "create" | "edit";
  onRetryMediaUpload: () => void;
  onSubmit: (saveAsDraft?: boolean) => void;
};

export function ListingSubmitActions({
  isDisabled,
  isSubmitting,
  isUploadingMedia,
  mediaRetryListingId,
  mode,
  onRetryMediaUpload,
  onSubmit,
}: ListingSubmitActionsProps) {
  const isBusy = isSubmitting || isUploadingMedia;

  return (
    <div className="mt-6 grid gap-3">
      <Button
        className="w-full"
        disabled={isDisabled}
        onClick={() => onSubmit(false)}
        size="lg"
        type="button"
      >
        {isBusy ? (
          <>
            <Spinner aria-hidden="true" className="size-[18px]" />
            {isUploadingMedia ? "Загружаем фото" : "Сохраняем"}
          </>
        ) : mode === "create" ? (
          "Отправить на проверку"
        ) : (
          "Сохранить изменения"
        )}
      </Button>

      {mode === "create" ? (
        <Button
          className="w-full"
          disabled={isDisabled}
          onClick={() => onSubmit(true)}
          size="lg"
          type="button"
          variant="outline"
        >
          Сохранить как черновик
        </Button>
      ) : null}

      {mediaRetryListingId !== null ? (
        <Button
          className="w-full"
          disabled={isDisabled}
          onClick={onRetryMediaUpload}
          size="lg"
          type="button"
          variant="secondary"
        >
          {isUploadingMedia ? (
            <>
              <Spinner aria-hidden="true" className="size-[18px]" />
              Загружаем фото
            </>
          ) : (
            "Повторить загрузку фото"
          )}
        </Button>
      ) : null}
    </div>
  );
}
