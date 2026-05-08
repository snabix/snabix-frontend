import { ResetPasswordForm } from "@/src/features/auth/ui/reset-password-form";
import { AuthShell } from "@/src/widgets/auth/ui/auth-shell";

type ResetPasswordProps = {
  initialEmail?: string;
  initialToken?: string;
};

export function ResetPassword({
  initialEmail,
  initialToken,
}: ResetPasswordProps) {
  return (
    <AuthShell>
      <ResetPasswordForm
        initialEmail={initialEmail}
        initialToken={initialToken}
      />
    </AuthShell>
  );
}
