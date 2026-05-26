"use client";

import Link from "next/link";
import { Button } from "@/src/shared/ui/shadcn/button";

export function HeaderAuthActions() {
  return (
    <>
      <Link href="/sign-in">
        <Button
          className="header-button-secondary h-11 rounded-[18px] px-5 font-semibold"
          variant="outline"
        >
          Войти
        </Button>
      </Link>
    </>
  );
}
