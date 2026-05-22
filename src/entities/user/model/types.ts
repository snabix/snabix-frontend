export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  addresses: UserAddress[];
  isActive: boolean;
  emailVerifiedAt: string | null;
  avatar: UserAvatar | null;
}

export interface UserAddress {
  id: string;
  label: string | null;
  addressLine: string | null;
  isPrimary: boolean;
  region: {
    id: number;
    name: string;
    label: string;
  };
  city: {
    id: number;
    name: string;
    label: string;
  } | null;
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
