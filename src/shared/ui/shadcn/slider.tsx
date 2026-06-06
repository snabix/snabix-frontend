"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/src/shared/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    ref={ref}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--accent-soft)]">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--active-button-bg)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-[var(--surface)] bg-[var(--active-button-bg)] shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
