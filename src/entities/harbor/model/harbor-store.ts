import { create } from 'zustand';
import { HarborStoreModel } from '@entities/harbor/model/types';
import { getAllHarborData } from '@entities/harbor/utils/getAllHarborData';

import { DEFAULT_DATA, parseData } from '@entities/harbor/utils/parceData';
import {
  EMPTY_TOKEN,
  getHarborToken
} from '@entities/harbor/utils/getHarborToken';

export const useHarborStore = create<HarborStoreModel>((set) => ({
  data: DEFAULT_DATA,
  token: EMPTY_TOKEN,
  loading: false,

  updateAll: async (address: string) => {
    try {
      set({ loading: true });
      const data = await getAllHarborData(address);

      if (data) {
        set({ data: parseData(data) });
        return data;
      }
      const token = await getHarborToken(address);
      set({ token });
    } finally {
      set({ loading: false });
    }
  }
}));
