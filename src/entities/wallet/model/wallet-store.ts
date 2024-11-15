import { create } from 'zustand';
import { IsNullableAccount, WalletStore } from './types';

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  setWallet: (wallet: IsNullableAccount) => set({ wallet })
}));
