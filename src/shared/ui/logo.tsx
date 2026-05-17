import Image from "next/image";
import Link from "next/link";

type LogoProps = {
    href?: string;
};

export function Logo({href = "/"}: LogoProps) {
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
