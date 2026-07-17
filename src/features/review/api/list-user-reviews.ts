import { z } from "zod";
import {
  getPaginated,
  type ApiPaginatedData,
} from "@/src/shared/api";
import { nullableStringSchema } from "@/src/shared/api/schemas/common";

const userReviewSchema = z.object({
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
  status: z.string(),
  statusLabel: z.string(),
  createdAt: nullableStringSchema,
}).strict();

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
