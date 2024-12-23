import { create } from 'zustand';
import { StakeHBRActionsStore } from './types';

export const useStakeHBRActionsStore = create<StakeHBRActionsStore>((set) => ({
  amount: '',
  onChangeHBRAmountToStake: (amount) => set({ amount })
}));
