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
  onCodeChangeAction: (value: string) => void;
  onConfirmAction: () => void;
  onOpenChangeAction: (isOpen: boolean) => void;
  onResendAction: () => void;
};

export function EmailVerificationDialog({
  code,
  cooldownSeconds,
  email,
  isConfirming,
  isOpen,
  isSending,
  onCodeChangeAction,
  onConfirmAction,
  onOpenChangeAction,
  onResendAction,
}: EmailVerificationDialogProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const codeRef = useRef(code);

  const codeCells = Array.from({ length: 6 });
  const codeDigits = Array.from({ length: 6 }, (_, index) => code[index] ?? "");
  const isCodeComplete = codeDigits.every((digit) => digit !== "");

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.setTimeout(() => {
      const currentDigits = getCodeDigits(codeRef.current);
      const nextEmptyIndex = currentDigits.findIndex((digit) => digit === "");
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;

      inputRefs.current[focusIndex]?.focus();
    }, 0);
  }, [code, isOpen]);

  const applyCodeChange = (value: string) => {
    const nextCode = value.replace(/\D/g, "").slice(0, 6);

    codeRef.current = nextCode;
    onCodeChangeAction(nextCode);
  };

  const handleChange = (index: number, value: string) => {
    const normalizedValue = value.replace(/\D/g, "");
    const currentDigits = getCodeDigits(codeRef.current);

    if (normalizedValue === "") {
      const nextCode = currentDigits.map((digit, currentIndex) => (
        currentIndex === index ? "" : digit
      )).join("");

      applyCodeChange(nextCode);
      return;
    }

    if (normalizedValue.length > 1) {
      const pastedValue = normalizedValue.slice(0, 6);

      applyCodeChange(pastedValue);
      inputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
      return;
    }

    const nextCode = currentDigits.map((digit, currentIndex) => (
      currentIndex === index ? normalizedValue : digit
    )).join("");

    applyCodeChange(nextCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
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

    applyCodeChange(pastedValue);
    inputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
  };

  return (
    <Dialog onOpenChange={onOpenChangeAction} open={isOpen}>
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
            <div className="grid grid-cols-6 gap-2.5">
              {codeCells.map((_, index) => (
                <label className="relative block" key={index}>
                  <span className="sr-only">Цифра {index + 1}</span>
                  <input
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className={[
                      "h-14 w-full rounded-2xl border bg-[var(--surface)] text-center text-lg font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                      codeDigits[index]
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
                    value={codeDigits[index]}
                  />
                </label>
              ))}
            </div>

            <p className="mt-3 text-center text-sm text-[var(--text-muted)]">
              Новый код можно запросить через 1 минуту.
            </p>
          </div>

          <DialogFooter className="mt-7">
            <Button
              className="h-11 rounded-2xl px-4"
              disabled={isSending || cooldownSeconds > 0}
              onClick={onResendAction}
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
              disabled={isConfirming || !isCodeComplete}
              onClick={onConfirmAction}
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

function getCodeDigits(value: string) {
  return Array.from({ length: 6 }, (_, index) => value[index] ?? "");
}
