import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    />
  );
}
