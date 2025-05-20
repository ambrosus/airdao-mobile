import { create } from 'zustand';
import { hbrYieldService } from '@api/harbor';
import {
  INITIAL_ETHERS_ZERO,
  INITIAL_LIMITS,
  limitsConfigMapper,
  stakeHbrPromise
} from '@entities/harbor/utils';
import type { StakeHBRStore } from './types';

export const useStakeHBRStore = create<StakeHBRStore>((set) => ({
  loading: false,
  refreshing: false,
  stake: INITIAL_ETHERS_ZERO,
  deposit: INITIAL_ETHERS_ZERO,
  rewards: INITIAL_ETHERS_ZERO,
  allowance: INITIAL_ETHERS_ZERO,
  limitsConfig: INITIAL_LIMITS,
  maxUserStakeValue: INITIAL_ETHERS_ZERO,
  totalPoolLimit: INITIAL_ETHERS_ZERO,
  fetchUserAllowance: async (address) => {
    const allowance = await hbrYieldService.allowance(address);

    set({ allowance });
  },
  hbrYieldFetcher: async (address, key = 'loading') => {
    set({ [key]: true });
    const result = await stakeHbrPromise(address);

    if (result) {
      const [
        stake,
        rewards,
        deposit,
        limitsConfig,
        poolInfo,
        maxUserStakeValue,
        allowance
      ] = result;

      set({
        stake,
        rewards,
        deposit,
        limitsConfig: limitsConfigMapper(limitsConfig),
        totalPoolLimit: poolInfo[0],
        maxUserStakeValue,
        allowance
      });
    }

    set({ [key]: false });
  }
}));
