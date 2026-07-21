import * as React from "react";
import { formatPhoneInputValue } from "@/src/shared/lib/format-phone-number";
import { Input } from "@/src/shared/ui/shadcn/input";

type PhoneInputProps = React.ComponentProps<typeof Input>;

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, onFocus, placeholder = "+7 (999) 000 - 00 - 00", ...props }, ref) => {
    return (
      <Input
        {...props}
        autoComplete="tel"
        inputMode="tel"
        onFocus={(event) => {
          if (event.target.value.trim() === "") {
            event.target.value = "+7";
            onChange?.(event);
          }

          onFocus?.(event);
        }}
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
