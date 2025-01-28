import { create } from 'zustand';
import { StakeUIStore } from './types';

export const useStakeUIStore = create<StakeUIStore>((set) => ({
  activeTabIndex: 0,
  setActiveTabIndex: (activeTabIndex) => set({ activeTabIndex })
}));
