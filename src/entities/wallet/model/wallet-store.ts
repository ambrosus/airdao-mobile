import { create } from 'zustand';
import { IsNullableAccount } from './types';

interface WalletStore {
  wallet: IsNullableAccount | null;
  setWallet: (wallet: IsNullableAccount) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  setWallet: (wallet: IsNullableAccount) => set({ wallet })
}));
