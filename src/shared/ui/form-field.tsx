import type { ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/src/shared/ui/shadcn/field";

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
  labelAccessory?: ReactNode;
  labelClassName?: string;
};

export function FormField({
  children,
  className,
  description,
  error,
  id,
  label,
  labelAccessory,
  labelClassName,
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <Field className={className} data-invalid={error ? true : undefined}>
      <FieldLabel className={labelClassName} htmlFor={id}>
        {label}
      </FieldLabel>

      {children({
        "aria-describedby": describedBy || undefined,
        "aria-errormessage": errorId,
        "aria-invalid": error ? true : undefined,
        id,
      })}

      {labelAccessory ? (
        <div className="absolute right-0 top-0">
          {labelAccessory}
        </div>
      ) : null}

      {description ? (
        <FieldDescription id={descriptionId}>
          {description}
        </FieldDescription>
      ) : null}

      {error ? (
        <FieldError id={errorId}>
          {error}
        </FieldError>
      ) : null}
    </Field>
  );
}
