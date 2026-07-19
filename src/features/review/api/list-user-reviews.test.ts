import { describe, expect, it } from "vitest";
import { userReviewSchema } from "./list-user-reviews";

const reviewContract = {
  id: "review-1",
  reviewer: {
    id: "buyer-1",
    firstName: "Анна",
    lastName: "Покупатель",
  },
  revieweeId: "seller-1",
  listing: {
    id: "listing-1",
    title: "Ноутбук",
  },
  rating: 5,
  comment: "Все прошло хорошо.",
  createdAt: "2026-07-19T12:00:00+00:00",
};

describe("userReviewSchema", () => {
  it("accepts the canonical semantic status fields", () => {
    expect(userReviewSchema.parse({
      ...reviewContract,
      reviewStatus: "published",
      reviewStatusLabel: "Опубликован",
    })).toMatchObject({
      reviewStatus: "published",
      reviewStatusLabel: "Опубликован",
    });
  });

  it("normalizes deprecated status aliases without leaking them", () => {
    const result = userReviewSchema.parse({
      ...reviewContract,
      status: "published",
      statusLabel: "Опубликован",
    });

    expect(result).toMatchObject({
      reviewStatus: "published",
      reviewStatusLabel: "Опубликован",
    });
    expect(result).not.toHaveProperty("status");
    expect(result).not.toHaveProperty("statusLabel");
  });

  it("rejects a review without canonical or legacy status fields", () => {
    expect(userReviewSchema.safeParse(reviewContract).success).toBe(false);
  });
});
