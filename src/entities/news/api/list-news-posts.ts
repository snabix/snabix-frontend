import type { NewsPostItem } from "@/src/entities/news/model/types";
import {
  api,
  newsPostItemSchema,
  paginatedContractSchema,
  parseApiContract,
  type ApiDataResponse,
  type ApiPaginatedData,
  unwrapApiPagination,
} from "@/src/shared/api";

export type ListNewsPostsParams = {
  page?: number;
  perPage?: number;
  category?: string;
  featuredOnly?: boolean;
};

export async function listNewsPosts(params: ListNewsPostsParams = {}): Promise<ApiPaginatedData<NewsPostItem>> {
  const response = await api.get<ApiDataResponse<unknown>>("/news", {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      category: params.category,
      featuredOnly: params.featuredOnly,
    },
  });

  return parseApiContract(
    paginatedContractSchema(newsPostItemSchema),
    unwrapApiPagination(response.data as ApiDataResponse<ApiPaginatedData<unknown>>),
    "Ответ списка новостей не соответствует ожидаемому формату.",
  ) as ApiPaginatedData<NewsPostItem>;
}
