"use client";

import * as React from "react";
import { formatPhoneInputValue } from "@/src/shared/lib/format-phone-number";
import { Input } from "@/src/shared/ui/shadcn/input";

type PhoneInputProps = React.ComponentProps<typeof Input>;

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, placeholder = "+7 (909) 009-09-09", ...props }, ref) => {
    return (
      <Input
        {...props}
        autoComplete="tel"
        inputMode="tel"
        onChange={(event) => {
          event.target.value = formatPhoneInputValue(event.target.value);
          onChange?.(event);
        }}
        placeholder={placeholder}
        ref={ref}
        type="tel"
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
