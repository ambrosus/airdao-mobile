export interface QueryResponse<T> {
  loading: boolean;
  error: any;
  data: T;
}

export interface PaginatedQueryResponse<T> extends QueryResponse<T> {
  hasNextPage: boolean;
  fetchNextPage: () => unknown;
}
