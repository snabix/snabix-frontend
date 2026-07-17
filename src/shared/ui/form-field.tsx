import type { ReactNode } from "react";
import { cn } from "@/src/shared/lib/utils";
import { Label } from "@/src/shared/ui/shadcn/label";

export type FormControlAccessibilityProps = {
  "aria-describedby"?: string;
  "aria-errormessage"?: string;
  "aria-invalid"?: true;
  id: string;
};

type FormFieldProps = {
  children: (controlProps: FormControlAccessibilityProps) => ReactNode;
  className?: string;
  description?: ReactNode;
  error?: string;
  id: string;
  label: ReactNode;
  labelAction?: ReactNode;
  labelClassName?: string;
};

export function FormField({
  children,
  className,
  description,
  error,
  id,
  label,
  labelAction,
  labelClassName,
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <div className={cn("relative grid gap-2", className)}>
      <Label className={labelClassName} htmlFor={id}>
        {label}
      </Label>

      {children({
        "aria-describedby": describedBy || undefined,
        "aria-errormessage": errorId,
        "aria-invalid": error ? true : undefined,
        id,
      })}

      {labelAction ? (
        <div className="absolute right-0 top-0">
          {labelAction}
        </div>
      ) : null}

      {description ? (
        <p
          className="text-sm leading-5 text-[var(--text-muted)]"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}

      {error ? (
        <p
          className="text-sm text-[var(--danger)]"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
