import { create } from 'zustand';
import { CacheableAccountList } from '@appTypes';

interface ListsStore {
  listsOfAddressGroup: CacheableAccountList[];
  onChangeListsOfAddressGroup: (payload: CacheableAccountList[]) => void;
}

export const useListsStore = create<ListsStore>((set) => ({
  listsOfAddressGroup: [],
  onChangeListsOfAddressGroup: (payload: CacheableAccountList[]) => {
    set({ listsOfAddressGroup: payload });
  }
}));
