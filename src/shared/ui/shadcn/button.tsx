import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/shared/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold",
    "transition-[color,background-color,border-color,box-shadow,filter] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
    "active:brightness-95",
    "disabled:pointer-events-none disabled:opacity-60",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[var(--shadow-card)] hover:bg-[color-mix(in_srgb,var(--button-primary-bg)_86%,var(--accent-strong))] hover:shadow-[0_18px_38px_color-mix(in_srgb,var(--accent)_18%,transparent)] active:shadow-[inset_0_2px_12px_color-mix(in_srgb,var(--brand-deep)_16%,transparent)]",
        secondary:
          "border border-[var(--border-soft)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:shadow-[0_14px_30px_color-mix(in_srgb,var(--accent)_12%,transparent)] active:shadow-[inset_0_2px_10px_color-mix(in_srgb,var(--brand-deep)_10%,transparent)]",
        ghost: "bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] active:bg-[color-mix(in_srgb,var(--accent-soft)_72%,var(--surface))]",
        outline:
          "border border-[var(--border-soft)] bg-transparent text-[var(--button-subtle-text)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] active:bg-[color-mix(in_srgb,var(--accent-soft)_72%,var(--surface))]",
        destructive:
          "bg-[var(--danger-bg)] !text-[var(--danger-text)] shadow-[var(--shadow-card)] hover:bg-[color-mix(in_srgb,var(--danger-bg)_86%,var(--foreground))] hover:!text-[var(--danger-text)] hover:shadow-[0_18px_38px_color-mix(in_srgb,var(--danger)_20%,transparent)] active:!text-[var(--danger-text)] active:shadow-[inset_0_2px_12px_color-mix(in_srgb,var(--foreground)_16%,transparent)] focus-visible:ring-[var(--danger-soft)] [&_svg]:!text-[var(--danger-text)] [&_svg]:!stroke-[var(--danger-text)]",
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
