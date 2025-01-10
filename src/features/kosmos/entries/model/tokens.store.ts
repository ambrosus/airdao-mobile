import { create } from 'zustand';
import { Token } from '../types/token';

interface MarketsStore {
  tokens: Token[];
  loading: boolean;
  onChangeTokens: (payload: Token[]) => void;
  onToggleLoading: (payload: boolean) => void;
}

export const useTokensStore = create<MarketsStore>((set) => ({
  tokens: [],
  loading: false,
  onChangeTokens: (tokens) => set({ tokens }),
  onToggleLoading: (loading) => set({ loading })
}));
