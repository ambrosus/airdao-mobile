import { create } from 'zustand';
import { StakeHBRActionsStore } from './types';

export const useStakeHBRActionsStore = create<StakeHBRActionsStore>((set) => ({
  // HBR Token Stake
  amount: '',
  onChangeHBRAmountToStake: (amount) => set({ amount }),

  // AMB Token Stake
  ambAmount: '',
  onChangeAMBAmountToStake: (ambAmount) => set({ ambAmount })
}));
