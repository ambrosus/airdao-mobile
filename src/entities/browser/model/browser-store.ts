import { create } from 'zustand';
import { browserService } from '@api/browser-service';
import { BrowserStoreModel } from '@entities/browser/model/types';

export const useBrowserStore = create<BrowserStoreModel>((set) => ({
  connectedAddress: '',
  browserConfig: {
    products: []
  },
  connectedAccount: null,
  setConnectedAccount: async (connectedAccount) => {
    set({ connectedAccount });
  },
  setConnectedAddress: async (connectedAddress) => {
    set({ connectedAddress });
  },
  setBrowserConfig: async () => {
    set({ browserConfig: await browserService.getBrowserConfig() });
  }
}));
