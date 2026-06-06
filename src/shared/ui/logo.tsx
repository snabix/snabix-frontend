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
                className="relative block h-[38px] w-[176px] shrink-0 sm:h-[42px] sm:w-[194px]"
                href={href}
            >
                <Image
                    alt="SNABIX"
                    className="h-full w-full object-contain object-left"
                    height={191}
                    priority
                    src="/logo2.png"
                    width={1177}
                />
            </Link>
        );
    }

    return (
        <Link className="flex items-center gap-3" href={href}>
      <span
          className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))] shadow-[var(--shadow-card)]">
        <Image
            alt="SNABIX"
            className="h-full w-full object-cover"
            height={50}
            priority
            src="/logo.png"
            width={50}
        />
      </span>
        </Link>
    );
}
