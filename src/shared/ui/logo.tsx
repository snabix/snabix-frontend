import Image from "next/image";
import Link from "next/link";

type LogoProps = {
    href?: string;
    variant?: "mark" | "wordmark";
};

export function Logo({ href = "/", variant = "mark" }: LogoProps) {
    if (variant === "wordmark") {
        return (
            <Link
                aria-label="SNABIX — главная"
                className="inline-flex h-10 w-[182px] shrink-0 items-center sm:h-11 sm:w-[204px]"
                href={href}
            >
                <Image
                    alt="SNABIX"
                    className="h-auto w-full object-contain object-left"
                    height={190}
                    priority
                    sizes="(min-width: 640px) 204px, 182px"
                    src="/snabix-logo.png"
                    width={830}
                />
            </Link>
        );
    }

    return (
        <Link aria-label="SNABIX — главная" className="inline-flex items-center" href={href}>
      <span
          className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden">
        <Image
            alt="SNABIX"
            className="h-full w-full object-contain"
            height={190}
            priority
            sizes="64px"
            src="/snabix-mark.png"
            width={260}
        />
      </span>
        </Link>
    );
}
