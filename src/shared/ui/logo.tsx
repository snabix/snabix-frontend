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
        className="relative inline-flex h-10 w-[132px] shrink-0 items-center overflow-hidden sm:h-11 sm:w-[146px]"
        href={href}
      >
        <Image
          alt="SNABIX"
          className="h-full w-full origin-left scale-[1.7] object-contain object-left translate-x-[-3px] dark:hidden"
          height={582}
          priority
          sizes="(min-width: 640px) 146px, 132px"
          src="/snabix-black.png"
          unoptimized
          width={1143}
        />
        <Image
          alt=""
          aria-hidden="true"
          className="hidden h-full w-full origin-left scale-[1.7] object-contain object-left translate-x-[-3px] dark:block"
          height={916}
          priority
          sizes="(min-width: 640px) 146px, 132px"
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
        className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden"
      >
        <Image
          alt="SNABIX"
          className="h-full w-full scale-[1.72] object-contain dark:hidden"
          height={582}
          priority
          sizes="44px"
          src="/snabix-black.png"
          unoptimized
          width={1143}
        />
        <Image
          alt=""
          aria-hidden="true"
          className="hidden h-full w-full scale-[1.72] object-contain dark:block"
          height={916}
          priority
          sizes="44px"
          src="/snabix-white.png"
          unoptimized
          width={1718}
        />
      </span>
    </Link>
  );
}
