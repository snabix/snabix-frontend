import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type User, useUserStore } from "@/src/entities/user";
import {
  profileFormSchema,
  updateProfile,
} from "@/src/features/profile";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import type { ProfileFormValues } from "@/src/screens/account/profile/ui/profile-types";

type UseProfileEditorOptions = {
  onEmailVerificationRequired: () => void;
};

export function useProfileEditor({
  onEmailVerificationRequired,
}: UseProfileEditorOptions) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEmailVerified = Boolean(user?.emailVerifiedAt);
  const profileInitialValues = useMemo<ProfileFormValues>(() => ({
    dateOfBirth: user?.dateOfBirth ?? "",
    description: user?.description ?? "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
  }), [
    user?.dateOfBirth,
    user?.description,
    user?.firstName,
    user?.lastName,
  ]);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: profileInitialValues,
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    reset(profileInitialValues);
  }, [profileInitialValues, reset]);

  const handleEdit = () => {
    reset(profileInitialValues);
    setIsProfileModalOpen(true);
  };

  const handleCancel = () => {
    setIsProfileModalOpen(false);
  };

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    const previousUser = user;
    const previousEmail = previousUser?.email ?? null;
    const wasEmailVerified = isEmailVerified;

    setIsSubmitting(true);

    try {
      const optimisticUser: User | null = previousUser
        ? {
            ...previousUser,
            dateOfBirth: values.dateOfBirth || null,
            description: values.description.trim() || null,
            firstName: values.firstName,
            lastName: values.lastName,
          }
        : null;

      if (optimisticUser) {
        setUser(optimisticUser);
      }

      const updatedUser = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        description: values.description.trim() || null,
        dateOfBirth: values.dateOfBirth || null,
        email: previousUser?.email ?? "",
        phoneNumber: previousUser?.phoneNumber ?? null,
      });

      setUser(updatedUser);
      setIsProfileModalOpen(false);

      if (
        previousEmail !== null
        && previousEmail !== updatedUser.email
        && wasEmailVerified
        && !updatedUser.emailVerifiedAt
      ) {
        onEmailVerificationRequired();
        toast.success("Профиль обновлен. Новый email нужно подтвердить повторно.");
      } else {
        toast.success("Профиль обновлен.");
      }
    } catch (error) {
      setUser(previousUser);
      toast.error(extractApiError(error, "Не удалось обновить профиль."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    handleCancel,
    handleEdit,
    handleProfileSubmit,
    handleSubmit,
    isProfileModalOpen,
    isSubmitting,
    register,
    setIsProfileModalOpen,
  };
}
