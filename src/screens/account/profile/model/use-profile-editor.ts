import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
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
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    region: "КЧР",
    city: "Черкесск",
  }), [user?.email, user?.firstName, user?.lastName, user?.phoneNumber]);
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
    setIsSubmitting(true);

    try {
      const previousEmail = user?.email ?? null;
      const wasEmailVerified = isEmailVerified;
      const updatedUser = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber?.trim() || null,
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
