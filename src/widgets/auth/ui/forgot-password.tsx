import { ForgotPasswordForm } from "@/src/features/auth/ui/forgot-password-form";
import { AuthShell } from "@/src/widgets/auth/ui/auth-shell";

export function ForgotPassword() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
