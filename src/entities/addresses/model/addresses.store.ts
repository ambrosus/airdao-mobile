import { create } from 'zustand';
import { ExplorerAccount } from '@models';

interface AddressesStore {
  allAddresses: ExplorerAccount[];
  loading: boolean;
  // Actions
  onSetAllAddresses: (payload: ExplorerAccount[]) => void;
  onToggleLoading: (payload: boolean) => void;
}

export const useAddressesStore = create<AddressesStore>((set) => ({
  allAddresses: [],
  loading: false,
  onSetAllAddresses: (allAddresses: ExplorerAccount[]) => {
    set({ allAddresses });
  },
  onToggleLoading: (loading: boolean) => {
    set({ loading });
  }
}));
