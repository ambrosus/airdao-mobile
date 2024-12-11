import { create } from 'zustand';
import { HarborStoreModel } from '@entities/harbor/model/types';
import { getAllHarborData } from '@entities/harbor/utils/getAllHarborData';

import { parseData } from '@entities/harbor/utils/parceData';
import { DEFAULT_DATA } from '../constants';

export const useHarborStore = create<HarborStoreModel>((set) => ({
  data: DEFAULT_DATA,
  loading: false,
  updateAll: async (address: string) => {
    try {
      set({ loading: true });
      const data = await getAllHarborData(address);

      if (data) {
        set({ data: parseData(data) });
        return data;
      }
    } finally {
      set({ loading: false });
    }
  }
}));
