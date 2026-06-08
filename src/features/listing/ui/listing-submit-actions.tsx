import { LoaderCircle } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";

type ListingSubmitActionsProps = {
  isDisabled: boolean;
  isSubmitting: boolean;
  isUploadingMedia: boolean;
  mediaRetryListingId: string | null;
  mode: "create" | "edit";
  onRetryMediaUploadAction: () => void;
  onSubmitAction: (saveAsDraft?: boolean) => void;
};

export function ListingSubmitActions({
  isDisabled,
  isSubmitting,
  isUploadingMedia,
  mediaRetryListingId,
  mode,
  onRetryMediaUploadAction,
  onSubmitAction,
}: ListingSubmitActionsProps) {
  const isBusy = isSubmitting || isUploadingMedia;

  return (
    <div className="mt-6 grid gap-3">
      <Button
        className="w-full"
        disabled={isDisabled}
        onClick={() => onSubmitAction(false)}
        size="lg"
        type="button"
      >
        {isBusy ? (
          <>
            <LoaderCircle className="animate-spin" size={18} />
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
          onClick={() => onSubmitAction(true)}
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
          onClick={onRetryMediaUploadAction}
          size="lg"
          type="button"
          variant="secondary"
        >
          {isUploadingMedia ? (
            <>
              <LoaderCircle className="animate-spin" size={18} />
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
