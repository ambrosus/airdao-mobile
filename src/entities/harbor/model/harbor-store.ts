import { BigNumber } from 'ethers';
import { create } from 'zustand';
import { harborService } from '@api/harbor/harbor-service';
import {
  HarborDataModel,
  HarborStoreModel,
  TierRewardItem
} from '@entities/harbor/model/types';
import { getAllHarborData } from '@entities/harbor/utils/getAllHarborData';
import { parseData } from '@entities/harbor/utils/parceData';
import { DEFAULT_DATA, REWARD_TIERS_LIST } from '../constants';

export const useHarborStore = create<HarborStoreModel>((set, get) => ({
  data: DEFAULT_DATA,
  loading: false,
  withdrawListLoader: false,
  activeAmbTier: REWARD_TIERS_LIST.amb[3],
  ambAmount: '0',
  claimAmount: BigNumber.from(0),
  withdrawalList: [],
  getClaimAmount: async (address: string) => {
    set({ claimAmount: await harborService.getClaimAmount(address) });
  },
  setRewardAmount: ({ ambAmount }) => {
    set({ ambAmount });
  },
  setActiveAmbTier: (activeAmbTier: TierRewardItem) => set({ activeAmbTier }),
  setDefaultActiveAmbTiers: () => {
    set({ activeAmbTier: REWARD_TIERS_LIST.amb[3] });
  },
  updateWithdrawList: async (address: string) => {
    try {
      set({ withdrawListLoader: true });
      const withdrawalList = await harborService.getWithdrawalRequests(address);
      set({ withdrawalList });
    } finally {
      set({ withdrawListLoader: false });
    }
  },
  clearWithdrawList: async () => {
    set({ withdrawalList: [] });
  },
  updateAll: async (address: string) => {
    if (!address || get().loading) {
      return;
    }

    try {
      set({ loading: true });

      const claimAmount = await harborService.getClaimAmount(address);
      const data = await getAllHarborData(address);

      if (data) {
        set({
          data: parseData<HarborDataModel>(data),
          claimAmount
        });
        return data;
      }
    } catch (error) {
      // Error is now handled by harbor-service.ts
    } finally {
      set({ loading: false });
    }
  }
}));
