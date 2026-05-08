export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  emailVerifiedAt: string | null;
}

export function getUserFullName(user: User | null) {
  if (!user) {
    return "Пользователь";
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return fullName || user.email;
}
