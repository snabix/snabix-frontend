import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserStore, type User } from "@/src/entities/user";
import {
  FAVORITE_LISTINGS_MAX_PER_PAGE,
  type ListFavoriteListingsParams,
} from "@/src/features/listing/api";
import { useFavoriteListings } from "@/src/features/listing/model/use-favorite-listings";

const {
  addListingFavoriteMock,
  listFavoriteListingsMock,
  removeListingFavoriteMock,
} = vi.hoisted(() => ({
  addListingFavoriteMock: vi.fn(),
  listFavoriteListingsMock: vi.fn(),
  removeListingFavoriteMock: vi.fn(),
}));

vi.mock("@/src/features/listing/api", async () => {
  const actual = await vi.importActual<typeof import("@/src/features/listing/api")>(
    "@/src/features/listing/api",
  );

  return {
    ...actual,
    addListingFavorite: addListingFavoriteMock,
    listFavoriteListings: listFavoriteListingsMock,
    removeListingFavorite: removeListingFavoriteMock,
  };
});

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const user: User = {
  addresses: [],
  avatar: null,
  email: "user@example.com",
  emailVerifiedAt: "2026-05-11T00:00:00Z",
  firstName: "Ivan",
  id: "1",
  isActive: true,
  lastName: "Petrov",
  phoneNumber: "+79990000000",
};

function FavoriteListingsProbe() {
  useFavoriteListings();

  return null;
}

describe("useFavoriteListings", () => {
  beforeEach(() => {
    addListingFavoriteMock.mockReset();
    listFavoriteListingsMock.mockReset();
    removeListingFavoriteMock.mockReset();
    useUserStore.setState(useUserStore.getInitialState(), true);
  });

  it("loads favorite IDs with a per-page value accepted by the API", async () => {
    useUserStore.getState().setUser(user);
    listFavoriteListingsMock.mockResolvedValue({
      items: [],
      meta: {
        currentPage: 1,
        from: null,
        lastPage: 1,
        perPage: FAVORITE_LISTINGS_MAX_PER_PAGE,
        to: null,
        total: 0,
      },
    });

    render(<FavoriteListingsProbe />);

    await waitFor(() => {
      expect(listFavoriteListingsMock).toHaveBeenCalledWith({
        page: 1,
        perPage: FAVORITE_LISTINGS_MAX_PER_PAGE,
      } satisfies ListFavoriteListingsParams);
    });
  });
});
