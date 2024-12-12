import { create } from 'zustand';
import { BigNumber } from 'ethers';

import { HarborStoreModel, TierRewardItem } from '@entities/harbor/model/types';
import { getAllHarborData } from '@entities/harbor/utils/getAllHarborData';
import { parseData } from '@entities/harbor/utils/parceData';
import { DEFAULT_DATA, REWARD_TIERS_LIST } from '../constants';
import { harborService } from '@api/harbor/harbor-service';

export const useHarborStore = create<HarborStoreModel>((set) => ({
  data: DEFAULT_DATA,
  loading: false,
  activeAmbTier: REWARD_TIERS_LIST.amb[0],
  activeBondTier: REWARD_TIERS_LIST.bond[2],
  bondAmount: '0',
  ambAmount: '0',
  claimAmount: BigNumber.from(0),
  getClaimAmount: async (address: string) => {
    set({ claimAmount: await harborService.getClaimAmount(address) });
  },
  setRewardAmount: ({ ambAmount, bondAmount }) => {
    set({ ambAmount });
    set({ bondAmount });
  },
  setActiveAmbTier: (activeAmbTier: TierRewardItem) => set({ activeAmbTier }),
  setActiveBondTier: (activeBondTier: TierRewardItem) =>
    set({ activeBondTier }),
  updateAll: async (address: string) => {
    try {
      set({ loading: true });
      set({ claimAmount: await harborService.getClaimAmount(address) });
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
