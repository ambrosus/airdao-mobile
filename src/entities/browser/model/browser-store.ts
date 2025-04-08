import { create } from 'zustand';
import { browserService } from '@api/browser-service';
import { BrowserStoreModel } from '@entities/browser/model/types';

export const useBrowserStore = create<BrowserStoreModel>((set, get) => ({
  connectedAddress: '',
  browserConfig: {
    products: []
  },
  connectedAccount: null,
  productTitle: '',
  productIcon: '',
  getProductIcon: () => {
    return get().productIcon;
  },
  setProductTitle: async (productTitle) => {
    set({ productTitle });
  },
  setProductIcon: async (productIcon) => {
    set({ productIcon });
  },
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
