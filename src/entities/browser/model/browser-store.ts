import { create } from 'zustand';
import { BrowserStoreModel } from '@entities/harbor/model/types';

export const useBrowserStore = create<BrowserStoreModel>((set) => ({
  connectedAddress: '',
  setConnectedAddress: async (address: string) => {
    set({ connectedAddress: address });
  }
}));
