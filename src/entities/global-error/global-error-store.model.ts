export interface GlobalErrorState {
  error: { title: string; message: string } | null;
  setError: (error: { title: string; message: string }) => void;
  clearError: () => void;
}
