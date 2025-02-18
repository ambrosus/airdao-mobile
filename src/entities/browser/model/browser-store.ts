import { create } from 'zustand';
import { browserService } from '@api/browser-service';
import { BrowserStoreModel } from '@entities/browser/model/types';
import { IsNullableAccount } from '@entities/wallet/model/types';

export const useBrowserStore = create<BrowserStoreModel>((set) => ({
  connectedAddress: '',
  browserConfig: {
    products: []
  },
  connectedAccount: null,
  setConnectedAccount: async (account: IsNullableAccount) => {
    set({ connectedAccount: account });
  },
  setConnectedAddress: async (address: string) => {
    set({ connectedAddress: address });
  },
  setBrowserConfig: async () => {
    set({ browserConfig: await browserService.getBrowserConfig() });
  }
}));
