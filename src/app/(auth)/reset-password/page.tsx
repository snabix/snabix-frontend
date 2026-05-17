import { ResetPassword } from "@/src/widgets/auth/ui/reset-password";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email?: string | string[];
    token?: string | string[];
  }>;
};

function getSearchParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <ResetPassword
      initialEmail={getSearchParam(params.email)}
      initialToken={getSearchParam(params.token)}
    />
  );
}
