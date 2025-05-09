import { create } from 'zustand';
import { RodeoToken } from '../types';

interface RodeoTokensStore {
  tokens: RodeoToken[];
  onChangeRodeoTokens: (tokens: RodeoToken[]) => void;
}

export const useRodeoTokensStore = create<RodeoTokensStore>((set) => ({
  tokens: [],
  onChangeRodeoTokens: (tokens) => set({ tokens })
}));
