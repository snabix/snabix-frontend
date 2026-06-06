"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    className={cn(
      "peer size-5 shrink-0 rounded-[6px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-sm",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
      "data-[state=checked]:border-[var(--brand)] data-[state=checked]:bg-[var(--brand)] data-[state=checked]:text-[var(--active-button-text)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check size={14} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
