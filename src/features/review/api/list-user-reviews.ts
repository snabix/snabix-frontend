import { z } from "zod";
import {
  getPaginated,
  type ApiPaginatedData,
} from "@/src/shared/api";
import { nullableStringSchema } from "@/src/shared/api/schemas/common";

const userReviewWireSchema = z.object({
  id: z.string(),
  reviewer: z.object({
    id: z.string(),
    firstName: nullableStringSchema,
    lastName: nullableStringSchema,
  }).strict(),
  revieweeId: z.string(),
  listing: z.object({
    id: z.string(),
    title: z.string(),
  }).strict(),
  rating: z.number(),
  comment: nullableStringSchema,
  reviewStatus: z.enum(["published", "hidden", "rejected"]).optional(),
  reviewStatusLabel: z.string().optional(),
  // Deprecated wire aliases are accepted for rolling deploys until 2026-10-31.
  status: z.enum(["published", "hidden", "rejected"]).optional(),
  statusLabel: z.string().optional(),
  createdAt: nullableStringSchema,
}).strict().superRefine((value, context) => {
  if (value.reviewStatus === undefined && value.status === undefined) {
    context.addIssue({
      code: "custom",
      message: "Missing canonical API field reviewStatus.",
      path: ["reviewStatus"],
    });
  }

  if (value.reviewStatusLabel === undefined && value.statusLabel === undefined) {
    context.addIssue({
      code: "custom",
      message: "Missing canonical API field reviewStatusLabel.",
      path: ["reviewStatusLabel"],
    });
  }
});

export const userReviewSchema = userReviewWireSchema.transform(({
  status,
  statusLabel,
  ...review
}) => ({
  ...review,
  reviewStatus: review.reviewStatus ?? status!,
  reviewStatusLabel: review.reviewStatusLabel ?? statusLabel ?? "",
}));

export type UserReview = z.infer<typeof userReviewSchema>;

export type ListUserReviewsParams = {
  page?: number;
  perPage?: number;
};

export async function listUserReviews(
  userId: string,
  params: ListUserReviewsParams = {},
): Promise<ApiPaginatedData<UserReview>> {
  return getPaginated(userReviewSchema, `/users/${userId}/reviews`, {
    config: {
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 10,
      },
    },
    errorMessage: "Ответ списка отзывов не соответствует ожидаемому формату.",
  });
}
