"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/shared/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold",
    "transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
    "disabled:pointer-events-none disabled:opacity-60",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-[var(--active-button-bg)] text-[var(--active-button-text)] shadow-[0_14px_28px_rgba(0,70,67,0.16)] hover:opacity-95",
        secondary:
          "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] text-[var(--brand-deep)] hover:bg-[var(--accent-soft)]",
        ghost: "text-[var(--brand-deep)] hover:bg-[var(--accent-soft)]",
        outline:
          "border border-[var(--border-soft)] bg-transparent text-[var(--brand-deep)] hover:bg-[var(--accent-soft)]",
        destructive:
          "bg-red-600 text-white shadow-[0_14px_28px_rgba(220,38,38,0.18)] hover:bg-red-500",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
