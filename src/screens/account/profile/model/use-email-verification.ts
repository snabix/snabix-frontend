import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { resendEmailVerification, verifyEmailCode } from "@/src/features/auth/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export function useEmailVerification() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isConfirmingVerification, setIsConfirmingVerification] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const isEmailVerified = Boolean(user?.emailVerifiedAt);

  useEffect(() => {
    if (resendCooldownSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldownSeconds((currentValue) => (
        currentValue > 0 ? currentValue - 1 : 0
      ));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [resendCooldownSeconds]);

  const openVerificationDialog = (cooldownSeconds = 60) => {
    setVerificationCode("");
    setResendCooldownSeconds(cooldownSeconds);
    setIsVerificationDialogOpen(true);
  };

  const handleResendVerification = async () => {
    setIsResendingVerification(true);

    try {
      const result = await resendEmailVerification();

      setResendCooldownSeconds(result.cooldownSeconds);

      if (result.sent) {
        setVerificationCode("");
        toast.success(result.message);
      } else {
        toast.message(result.message);
      }
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось отправить письмо повторно."));
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(value.replace(/\D/g, "").slice(0, 6));
  };

  const handleConfirmVerification = async () => {
    if (verificationCode.length !== 6) {
      return;
    }

    setIsConfirmingVerification(true);

    try {
      const result = await verifyEmailCode({
        code: verificationCode,
      });

      if (user) {
        setUser({
          ...user,
          emailVerifiedAt: result.verified ? new Date().toISOString() : user.emailVerifiedAt,
        });
      }

      setVerificationCode("");
      setIsVerificationDialogOpen(false);
      toast.success(result.message);
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось подтвердить email."));
    } finally {
      setIsConfirmingVerification(false);
    }
  };

  return {
    handleConfirmVerification,
    handleResendVerification,
    handleVerificationCodeChange,
    isConfirmingVerification,
    isEmailVerified,
    isResendingVerification,
    isVerificationDialogOpen,
    openVerificationDialog,
    resendCooldownSeconds,
    setIsVerificationDialogOpen,
    verificationCode,
  };
}
