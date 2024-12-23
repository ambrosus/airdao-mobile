import { create } from 'zustand';
import {
  INITIAL_ETHERS_ZERO,
  INITIAL_LIMITS,
  limitsConfigMapper,
  stakeHBRPromise
} from '@entities/harbor/utils';
import type { StakeHBRStore } from './types';

export const useStakeHBRStore = create<StakeHBRStore>((set) => ({
  stake: INITIAL_ETHERS_ZERO,
  deposit: INITIAL_ETHERS_ZERO,
  rewards: INITIAL_ETHERS_ZERO,
  limitsConfig: INITIAL_LIMITS,
  maxUserStakeValue: INITIAL_ETHERS_ZERO,
  totalPoolLimit: INITIAL_ETHERS_ZERO,
  loading: false,
  refreshing: false,
  hbrYieldFetcher: async (address: string, key = 'loading') => {
    set({ [key]: true });
    const [stake, rewards, deposit, limitsConfig, poolInfo, maxUserStakeValue] =
      await stakeHBRPromise(address);

    set({
      stake,
      rewards,
      deposit,
      limitsConfig: limitsConfigMapper(limitsConfig),
      totalPoolLimit: poolInfo[0],
      maxUserStakeValue
    });

    set({ [key]: false });
  }
}));
