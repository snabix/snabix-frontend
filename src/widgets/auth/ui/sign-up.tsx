import { SignUpForm } from "@/src/features/auth/ui/sign-up-form";
import { AuthShell } from "@/src/widgets/auth/ui/auth-shell";

export function SignUp() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  );
}
