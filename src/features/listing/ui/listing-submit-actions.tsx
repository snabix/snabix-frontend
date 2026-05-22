import { LoaderCircle } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";

type ListingSubmitActionsProps = {
  isDisabled: boolean;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onSubmit: (saveAsDraft?: boolean) => void;
};

export function ListingSubmitActions({
  isDisabled,
  isSubmitting,
  mode,
  onSubmit,
}: ListingSubmitActionsProps) {
  return (
    <div className="mt-6 grid gap-3">
      <Button
        className="w-full"
        disabled={isDisabled}
        onClick={() => onSubmit(false)}
        size="lg"
        type="button"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" size={18} />
            Сохраняем
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
    </div>
  );
}
