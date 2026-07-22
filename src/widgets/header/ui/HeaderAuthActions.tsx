import Link from "next/link";
import { Button } from "@/src/shared/ui/shadcn/button";

export function HeaderAuthActions() {
  return (
    <Button
      asChild
      className="header-button-secondary h-11 rounded-[var(--radius-control)] px-4 font-semibold sm:px-5"
      variant="outline"
    >
      <Link href="/sign-in">
        Войти
      </Link>
    </Button>
  );
}
