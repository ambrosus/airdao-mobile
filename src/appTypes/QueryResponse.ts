export interface QueryResponse<T> {
  loading: boolean;
  error: unknown;
  data: T;
  refetch?: () => void;
  refetching?: boolean;
  isFetchingNextPage?: boolean;
}

export interface PaginatedQueryResponse<T> extends QueryResponse<T> {
  hasNextPage: boolean;
  fetchNextPage: () => unknown;
}
