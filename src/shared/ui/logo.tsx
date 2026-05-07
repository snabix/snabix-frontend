import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type LogoProps = {
  href?: string;
};

export function Logo({ href = "/" }: LogoProps) {
  return (
    <Link className="flex items-center gap-3" href={href}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand),var(--accent))] text-white shadow-[0_16px_34px_rgba(2,28,79,0.22)]">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
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
