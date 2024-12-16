import { create } from 'zustand';
import { staking } from '@api/staking/staking-service';
import { ReturnedPoolDetails } from '@api/staking/types';

interface StakingPoolsStore {
  isInitialFetching: boolean;
  isFetching: boolean;
  pools: ReturnedPoolDetails[];
  fetchPoolDetails: (
    selectedWallet: string,
    isMultiply?: boolean
  ) => Promise<void>;
}

type SetState = (
  partial:
    | Partial<StakingPoolsStore>
    | ((state: StakingPoolsStore) => Partial<StakingPoolsStore>)
) => void;

function toggleLoadingState(set: SetState, isMultiply = false, state: boolean) {
  isMultiply ? set({ isInitialFetching: state }) : set({ isFetching: state });
}

export const useStakingPoolsStore = create<StakingPoolsStore>((set) => ({
  pools: [],
  isFetching: false,
  isInitialFetching: false,
  fetchPoolDetails: async (selectedWallet, isMultiply = false) => {
    try {
      toggleLoadingState(set, isMultiply, true);
      const response = await staking.getStakingPoolsDetails({
        address: selectedWallet
      });

      if (response) set({ pools: response });
    } finally {
      toggleLoadingState(set, isMultiply, false);
    }
  }
}));
