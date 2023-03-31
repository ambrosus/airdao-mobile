export interface QueryResponse<T> {
  loading: boolean;
  error: any;
  data: T;
}
