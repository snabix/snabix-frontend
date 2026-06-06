import type { NewsPostDetail } from "@/src/entities/news/model/types";
import {
  api,
  newsPostDetailSchema,
  parseApiContract,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";

export async function showNewsPost(slug: string): Promise<NewsPostDetail> {
  const response = await api.get<ApiDataResponse<unknown>>(`/news/${slug}`);

  return parseApiContract(
    newsPostDetailSchema,
    unwrapApiData(response.data),
    "Ответ детальной страницы новости не соответствует ожидаемому формату.",
  );
}
