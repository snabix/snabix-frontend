import Image from "next/image";
import Link from "next/link";

type LogoProps = {
    href?: string;
};

export function Logo({ href = "/" }: LogoProps) {
    return (
        <Link className="flex items-center gap-3" href={href}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent))] shadow-[0_16px_34px_rgba(0,70,67,0.22)]">
        <Image
            alt="SNABIX"
            className="h-full w-full object-cover"
            height={44}
            priority
            src="/logo.png"
            width={44}
        />
      </span>

            <span>
        <span className="font-heading block text-lg font-extrabold text-[var(--brand-deep)]">
          SNABIX
        </span>

        <span className="block text-xs text-[var(--text-muted)]">
          marketplace platform
        </span>
      </span>
        </Link>
    );
}