import { ethers } from 'ethers';
import { create } from 'zustand';

export interface PurchaseStore {
  amountToBuy: string;
  onChangeAmountToBuy: (payload: string) => void;
  bnBalance: ethers.BigNumber | null;
  onChangeBnBalance: (payload: ethers.BigNumber | null) => void;
}

export const usePurchaseStore = create<PurchaseStore>((set) => ({
  amountToBuy: '',
  bnBalance: null,
  onChangeAmountToBuy: (amountToBuy) => set({ amountToBuy }),
  onChangeBnBalance: (bnBalance) => set({ bnBalance })
}));
