import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/src/shared/lib/utils";

function Spinner({
  "aria-label": ariaLabel = "Загрузка",
  className,
  ...props
}: ComponentProps<typeof LoaderCircle>) {
  return (
    <LoaderCircle
      aria-label={ariaLabel}
      className={cn("size-4 animate-spin", className)}
      data-slot="spinner"
      role="status"
      {...props}
    />
  );
}

export { Spinner };
