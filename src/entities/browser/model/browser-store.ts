import { create } from 'zustand';
import { browserService } from '@api/browser-service';
import { BrowserStoreModel } from '@entities/browser/model/types';

export const useBrowserStore = create<BrowserStoreModel>((set) => ({
  connectedAddress: '',
  browserConfig: {
    products: []
  },
  setConnectedAddress: async (address: string) => {
    set({ connectedAddress: address });
  },
  setBrowserConfig: async () => {
    set({ browserConfig: await browserService.getBrowserConfig() });
  }
}));
