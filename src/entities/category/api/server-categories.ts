import "server-only";

import type { CategoryNode } from "@/src/entities/category";
import { categoryNodeSchema } from "@/src/shared/api";
import { serverGetData } from "@/src/shared/api/server-request";

const categoryRevalidateSeconds = 60 * 60;

export async function listRootCategoriesServer(): Promise<CategoryNode[]> {
  return serverGetData(categoryNodeSchema.array(), "/categories/list", {
    errorMessage: "Не удалось загрузить категории.",
    revalidate: categoryRevalidateSeconds,
    tags: ["categories", "categories:roots"],
  });
}

export async function showCategoryBranchServer(
  categoryId: string | number,
): Promise<CategoryNode> {
  return serverGetData(
    categoryNodeSchema,
    `/categories/${encodeURIComponent(String(categoryId))}/branch`,
    {
      errorMessage: "Не удалось загрузить раздел каталога.",
      revalidate: categoryRevalidateSeconds,
      tags: ["categories", `category:${categoryId}`],
    },
  );
}
