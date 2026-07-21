import type { ComponentProps } from "react";
import { cn } from "@/src/shared/lib/utils";
import { Label } from "@/src/shared/ui/shadcn/label";

function Field({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("relative grid gap-2", className)}
      data-slot="field"
      role="group"
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn("leading-none", className)}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm leading-5 text-[var(--text-muted)]", className)}
      data-slot="field-description"
      {...props}
    />
  );
}

function FieldError({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-[var(--danger)]", className)}
      data-slot="field-error"
      role="alert"
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldLabel };
