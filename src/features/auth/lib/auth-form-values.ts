export type SignInFormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type ChangePasswordFormValues = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};
