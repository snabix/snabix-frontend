export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type AuthResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
  };
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
};
