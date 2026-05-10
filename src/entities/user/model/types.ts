export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  emailVerifiedAt: string | null;
  avatar: UserAvatar | null;
}

export interface UserAvatar {
  id: number;
  url: string | null;
  fileName: string;
  mimeType: string | null;
  size: number;
  humanReadableSize: string;
}

export function getUserFullName(user: User | null) {
  if (!user) {
    return "";
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return fullName || user.email;
}
