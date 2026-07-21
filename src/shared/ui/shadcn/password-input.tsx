"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className={cn(
        "flex h-12 w-full items-center rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 shadow-[inset_0_1px_0_var(--border-soft)]",
        "focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--accent)_12%,transparent)]",
        className,
      )}
    >
      <input
        className="h-full flex-1 border-0 bg-transparent text-sm text-[var(--brand-deep)] placeholder:text-[var(--text-muted)] focus:outline-none"
        ref={ref}
        type={isVisible ? "text" : "password"}
        {...props}
      />

      <button
        aria-controls={props.id}
        aria-label={isVisible ? "Скрыть пароль" : "Показать пароль"}
        aria-pressed={isVisible}
        className="inline-flex size-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--brand-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-soft)]"
        onClick={() => setIsVisible((currentState) => !currentState)}
        type="button"
      >
        {isVisible ? (
          <EyeOff aria-hidden="true" size={16} />
        ) : (
          <Eye aria-hidden="true" size={16} />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
