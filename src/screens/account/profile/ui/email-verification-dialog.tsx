"use client";

import { type ClipboardEvent, type KeyboardEvent, useEffect, useRef } from "react";
import { LoaderCircle, MailCheck } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";

type EmailVerificationDialogProps = {
  code: string;
  cooldownSeconds: number;
  email: string;
  isConfirming: boolean;
  isOpen: boolean;
  isSending: boolean;
  onCodeChange: (value: string) => void;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onResend: () => void;
};

export function EmailVerificationDialog({
  code,
  cooldownSeconds,
  email,
  isConfirming,
  isOpen,
  isSending,
  onCodeChange,
  onConfirm,
  onOpenChange,
  onResend,
}: EmailVerificationDialogProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const codeCells = Array.from({ length: 6 }, (_, index) => {
    const symbol = code[index];

    return symbol && symbol.trim() !== "" ? symbol : "*";
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.setTimeout(() => {
      const focusIndex = Math.min(code.length, 5);

      inputRefs.current[focusIndex]?.focus();
    }, 0);
  }, [code.length, isOpen]);

  const handleChange = (index: number, value: string) => {
    const normalizedValue = value.replace(/\D/g, "");

    if (normalizedValue === "") {
      const nextCode = Array.from({ length: 6 }, (_, currentIndex) => (
        currentIndex === index ? "" : (code[currentIndex] ?? "")
      )).join("");

      onCodeChange(nextCode);
      return;
    }

    if (normalizedValue.length > 1) {
      const pastedValue = normalizedValue.slice(0, 6);

      onCodeChange(pastedValue);
      inputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
      return;
    }

    const nextCode = Array.from({ length: 6 }, (_, currentIndex) => (
      currentIndex === index ? normalizedValue : (code[currentIndex] ?? "")
    )).join("");

    onCodeChange(nextCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (pastedValue === "") {
      return;
    }

    onCodeChange(pastedValue);
    inputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="max-w-[460px] p-0">
        <div className="p-6 sm:p-7">
          <DialogHeader className="items-center text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <MailCheck aria-hidden="true" size={20} />
            </div>

            <DialogTitle className="mt-4">
              Подтвердите email
            </DialogTitle>

            <DialogDescription className="mt-2 max-w-[320px]">
              Введите код из письма для <span className="font-semibold text-[var(--brand-deep)]">{email}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-7">
            <div className="rounded-[24px] border border-[color-mix(in_srgb,var(--accent)_14%,var(--border-soft))] bg-[color-mix(in_srgb,var(--surface)_90%,white)] p-4 shadow-[0_18px_36px_rgba(26,34,56,0.05)]">
              <div className="grid grid-cols-6 gap-2.5">
                {codeCells.map((cell, index) => (
                  <label className="relative block" key={index}>
                    <span className="sr-only">Цифра {index + 1}</span>
                    <input
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      className={[
                        "h-14 w-full rounded-2xl border bg-[var(--surface)] text-center text-lg font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                        code[index]
                          ? "border-[color-mix(in_srgb,var(--accent)_26%,var(--border-soft))] text-[var(--brand-deep)]"
                          : "border-[var(--border-soft)] text-transparent caret-[var(--brand-deep)]",
                      ].join(" ")}
                      inputMode="numeric"
                      maxLength={1}
                      onChange={(event) => handleChange(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      onPaste={handlePaste}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="text"
                      value={code[index] ?? ""}
                    />

                    {!code[index] ? (
                      <div className="pointer-events-none absolute inset-0 grid place-items-center text-lg font-extrabold text-[var(--text-muted)]">
                        {cell}
                      </div>
                    ) : null}
                  </label>
                ))}
              </div>
            </div>

            <p className="mt-3 text-center text-sm text-[var(--text-muted)]">
              Новый код можно запросить через 1 минуту.
            </p>
          </div>

          <DialogFooter className="mt-7">
            <Button
              className="h-11 rounded-2xl px-4"
              disabled={isSending || cooldownSeconds > 0}
              onClick={onResend}
              type="button"
              variant="secondary"
            >
              {isSending ? (
                <>
                  <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
                  Отправляем...
                </>
              ) : cooldownSeconds > 0 ? (
                `Повторно через ${cooldownSeconds} c`
              ) : (
                "Отправить снова"
              )}
            </Button>

            <Button
              className="h-11 rounded-2xl px-4"
              disabled={isConfirming || code.length !== 6}
              onClick={onConfirm}
              type="button"
            >
              {isConfirming ? (
                <>
                  <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
                  Проверяем...
                </>
              ) : (
                "Подтвердить"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
