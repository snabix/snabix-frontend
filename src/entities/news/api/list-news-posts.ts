import type { NewsPostItem } from "@/src/entities/news/model/types";
import {
  getPaginated,
  newsPostItemSchema,
  type ApiPaginatedData,
} from "@/src/shared/api";

export type ListNewsPostsParams = {
  page?: number;
  perPage?: number;
  category?: string;
  featuredOnly?: boolean;
};

export async function listNewsPosts(params: ListNewsPostsParams = {}): Promise<ApiPaginatedData<NewsPostItem>> {
  return getPaginated(newsPostItemSchema, "/news", {
    config: {
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 12,
        category: params.category,
        featuredOnly: params.featuredOnly,
      },
    },
    errorMessage: "Ответ списка новостей не соответствует ожидаемому формату.",
  });
}
