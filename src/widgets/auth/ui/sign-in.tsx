import { SignInForm } from "@/src/features/auth/ui/sign-in-form";
import { AuthShell } from "@/src/widgets/auth/ui/auth-shell";

export function SignIn() {
  return (
    <AuthShell>
      <SignInForm />
    </AuthShell>
  );
}
