export type ApiDataResponse<TData> = {
  data: TData;
};

export function unwrapApiData<TData>(
  response: ApiDataResponse<TData>,
): TData {
  return response.data;
}

