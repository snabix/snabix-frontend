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
                className="inline-flex h-10 w-[136px] shrink-0 items-center sm:h-11 sm:w-[152px]"
                href={href}
            >
                <Image
                    alt="SNABIX"
                    className="h-full w-full object-contain object-left dark:hidden"
                    height={582}
                    priority
                    sizes="(min-width: 640px) 152px, 136px"
                    src="/snabix-black.png"
                    unoptimized
                    width={1143}
                />
                <Image
                    alt=""
                    aria-hidden="true"
                    className="hidden h-full w-full object-contain object-left dark:block"
                    height={916}
                    priority
                    sizes="(min-width: 640px) 152px, 136px"
                    src="/snabix-white.png"
                    unoptimized
                    width={1718}
                />
            </Link>
        );
    }

    return (
        <Link aria-label="SNABIX — главная" className="inline-flex items-center" href={href}>
      <span
          className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
        <Image
            alt="SNABIX"
            className="h-full w-full object-contain dark:hidden"
            height={582}
            priority
            sizes="48px"
            src="/snabix-black.png"
            unoptimized
            width={1143}
        />
        <Image
            alt=""
            aria-hidden="true"
            className="hidden h-full w-full object-contain dark:block"
            height={916}
            priority
            sizes="48px"
            src="/snabix-white.png"
            unoptimized
            width={1718}
        />
      </span>
        </Link>
    );
}
