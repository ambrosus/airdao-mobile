import { create } from 'zustand';
import { GlobalErrorState } from './global-error-store.model';

export const useGlobalErrorStore = create<GlobalErrorState>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
