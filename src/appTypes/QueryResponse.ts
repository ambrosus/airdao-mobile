export interface QueryResponse<T> {
  loading: boolean;
  error: any;
  data: T;
  refetch?: () => void;
  refetching?: boolean;
  isFetchingNextPage?: boolean;
}

export interface PaginatedQueryResponse<T> extends QueryResponse<T> {
  hasNextPage: boolean;
  fetchNextPage: () => unknown;
}
