import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useCategoryStore,
  type CategoryAttributeDefinition,
  type CategoryNode,
} from "@/src/entities/category";
import type { ListingItem } from "@/src/entities/listing";
import {
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_TEXT,
} from "@/src/features/listing/model/listing-form-constants";
import { ListingForm } from "@/src/features/listing/ui/listing-form";

const { pushMock, refreshMock, toastErrorMock, toastSuccessMock, uploadListingMediaMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
  refreshMock: vi.fn<() => void>(),
  toastErrorMock: vi.fn<(message: string) => void>(),
  toastSuccessMock: vi.fn<(message: string) => void>(),
  uploadListingMediaMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

vi.mock("@/src/features/listing/api", async () => {
  const actual = await vi.importActual<typeof import("@/src/features/listing/api")>(
    "@/src/features/listing/api",
  );

  return {
    ...actual,
    uploadListingMedia: uploadListingMediaMock,
  };
});

const rootCategory: CategoryNode = {
  catalogType: 1,
  catalogTypeLabel: "Товары",
  children: [],
  depth: 0,
  description: null,
  icon: null,
  id: 5,
  isActive: true,
  name: "Электроника",
  parentId: null,
  path: null,
  slug: "elektronika",
  sortOrder: 1,
};

const listingContract: ListingItem = {
  attributeValues: [],
  category: {
    catalogType: 1,
    catalogTypeLabel: "Товары",
    id: 5,
    name: "Электроника",
    parentId: null,
    slug: "elektronika",
  },
  condition: 2,
  conditionLabel: "Б/у",
  contactEmail: null,
  contactName: null,
  contactPhone: null,
  currency: "RUB",
  description: "Игровой ноутбук в хорошем состоянии.",
  expiresAt: null,
  id: "listing-1",
  imageUrl: null,
  imageUrls: [],
  isFeatured: false,
  isNegotiable: false,
  media: [],
  price: 85000,
  publishedAt: null,
  rejectionReason: null,
  slug: "igrovoj-noutbuk",
  status: 1,
  statusLabel: "Черновик",
  title: "Игровой ноутбук",
  type: 1,
  typeLabel: "Товар",
  userId: "user-1",
  viewsCount: 0,
};

describe("ListingForm integration", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    uploadListingMediaMock.mockReset();
    useCategoryStore.setState({
      branches: { 5: rootCategory },
      branchesFetchedAt: { 5: Date.now() },
      branchStatuses: { 5: "success" },
      categoryAttributes: { 5: [] },
      categoryAttributesFetchedAt: { 5: Date.now() },
      categoryAttributeStatuses: { 5: "success" },
      roots: [rootCategory],
      rootsFetchedAt: Date.now(),
      rootsStatus: "success",
    });
  });

  it("creates listing as draft when draft action is selected", async () => {
    const onSubmit = vi.fn().mockResolvedValue(listingContract);

    render(<ListingForm mode="create" onSubmit={onSubmit} />);

    fillListingForm();
    fireEvent.click(screen.getByRole("button", { name: "Сохранить как черновик" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        categoryId: 5,
        price: 85000,
        saveAsDraft: true,
        title: "Игровой ноутбук",
      }));
      expect(pushMock).toHaveBeenCalledWith("/account/listings/listing-1");
    });
  });

  it("creates listing for pending review when primary action is selected", async () => {
    const onSubmit = vi.fn().mockResolvedValue(listingContract);

    render(<ListingForm mode="create" onSubmit={onSubmit} />);

    fillListingForm();
    fireEvent.click(screen.getByRole("button", { name: "Отправить на проверку" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        categoryId: 5,
        saveAsDraft: false,
        title: "Игровой ноутбук",
      }));
      expect(toastSuccessMock).toHaveBeenCalledWith("Объявление отправлено на проверку.");
    });
  });

  it("keeps user in edit flow with retry action when media upload fails after save", async () => {
    const onSubmit = vi.fn().mockResolvedValue(listingContract);
    uploadListingMediaMock.mockRejectedValue(new Error("Upload failed"));
    const { container } = render(
      <ListingForm
        initialListing={listingContract}
        mode="edit"
        onSubmit={onSubmit}
      />,
    );

    const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");

    expect(fileInput).not.toBeNull();

    fireEvent.change(fileInput as HTMLInputElement, {
      target: {
        files: [new File(["content"], "photo.png", { type: "image/png" })],
      },
    });
    fillListingForm();
    fireEvent.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(uploadListingMediaMock).toHaveBeenCalledWith("listing-1", expect.any(Array));
      expect(toastErrorMock).toHaveBeenCalledWith(
        "Объявление сохранено, но фотографии пока не загрузились. Проверьте соединение и повторите попытку.",
      );
      expect(pushMock).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Повторить загрузку фото" })).toBeInTheDocument();
    });
  });

  it("shows and prunes conditional attributes by dependency rules", async () => {
    setCategoryAttributes([
      makeAttribute({
        id: 10,
        name: "Бренд",
        options: ["Apple", "Samsung"],
        slug: "brand",
        type: ATTRIBUTE_TYPE_SELECT,
        typeLabel: "Список",
      }),
      makeAttribute({
        dependencyRules: [
          {
            attributeDefinitionId: 10,
            operator: "equals",
            value: "Apple",
          },
        ],
        id: 11,
        name: "Модель",
        placeholder: "Например, iPhone 15",
        slug: "model",
        type: ATTRIBUTE_TYPE_TEXT,
        typeLabel: "Текст",
      }),
    ]);

    render(<ListingForm mode="create" onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Бренд")).toBeInTheDocument();
    expect(screen.queryByLabelText("Модель")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Бренд"), {
      target: { value: "Apple" },
    });

    expect(await screen.findByLabelText("Модель")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Модель"), {
      target: { value: "iPhone 15" },
    });
    fireEvent.change(screen.getByLabelText("Бренд"), {
      target: { value: "Samsung" },
    });

    await waitFor(() => {
      expect(screen.queryByLabelText("Модель")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Бренд"), {
      target: { value: "Apple" },
    });

    expect(await screen.findByLabelText("Модель")).toHaveValue("");
  });
});

function fillListingForm() {
  fireEvent.change(screen.getByLabelText("Заголовок"), {
    target: { value: "Игровой ноутбук" },
  });
  fireEvent.change(screen.getByLabelText("Описание"), {
    target: { value: "Игровой ноутбук в хорошем состоянии." },
  });
  fireEvent.change(screen.getByLabelText("Цена"), {
    target: { value: "85000" },
  });
}

function setCategoryAttributes(attributes: CategoryAttributeDefinition[]) {
  useCategoryStore.setState({
    categoryAttributes: { 5: attributes },
    categoryAttributesFetchedAt: { 5: Date.now() },
    categoryAttributeStatuses: { 5: "success" },
  });
}

function makeAttribute(
  attribute: Partial<CategoryAttributeDefinition> & Pick<CategoryAttributeDefinition, "id" | "name" | "slug" | "type" | "typeLabel">,
): CategoryAttributeDefinition {
  return {
    appliesToChildren: false,
    categoryId: 5,
    defaultValue: null,
    dependencyRules: null,
    description: null,
    groupName: null,
    helpText: null,
    isActive: true,
    isFilterable: false,
    isInherited: false,
    isRequired: false,
    options: null,
    placeholder: null,
    schemaVersion: 1,
    showInCard: false,
    sortOrder: 1,
    unit: null,
    ...attribute,
  };
}
