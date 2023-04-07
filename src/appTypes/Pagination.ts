export interface PaginatedResponseBody<T> {
  data: T;
  next: string | null;
}
