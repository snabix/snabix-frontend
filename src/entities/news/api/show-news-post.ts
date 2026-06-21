import type { NewsPostDetail } from "@/src/entities/news/model/types";
import {
  getData,
  newsPostDetailSchema,
} from "@/src/shared/api";

export async function showNewsPost(slug: string): Promise<NewsPostDetail> {
  return getData(
    newsPostDetailSchema,
    `/news/${slug}`,
    { errorMessage: "Ответ детальной страницы новости не соответствует ожидаемому формату." },
  );
}
