export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type AuthResponse = {
  userId?: string;
  data?: {
    userId?: string;
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

export type ChangePasswordPayload = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

export type ChangePasswordResponse = {
  changed: boolean;
  message: string;
};

export type ActiveUserSession = {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string | null;
  type: "desktop" | "mobile" | "tablet";
  isCurrent: boolean;
  lastActivityAt: string | null;
};

export type ActiveUserSessionsResponse = {
  items: ActiveUserSession[];
};

export type TerminateSessionResponse = {
  terminated: boolean;
  terminatedCount?: number;
};
