export type ApiDataResponse<TData> = {
  data: TData;
};

export type ApiPaginationMeta = {
  currentPage: number;
  from: number | null;
  lastPage: number;
  perPage: number;
  to: number | null;
  total: number;
};

export type ApiPaginatedData<TItem> = {
  items: TItem[];
  meta: ApiPaginationMeta;
};

export function unwrapApiData<TData>(
  response: ApiDataResponse<TData>,
): TData {
  return response.data;
}

export function unwrapApiItems<TItem>(
  response: ApiDataResponse<ApiPaginatedData<TItem>>,
): TItem[] {
  return response.data.items;
}

export function unwrapApiPagination<TItem>(
  response: ApiDataResponse<ApiPaginatedData<TItem>>,
): ApiPaginatedData<TItem> {
  return response.data;
}
