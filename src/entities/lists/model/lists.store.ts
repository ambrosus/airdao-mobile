import { create } from 'zustand';
import { CacheableAccountList } from '@appTypes';
import { MutableRefObject, RefObject, useRef } from 'react';
import { BottomSheetRef } from '@components/composite';

interface ListsStore {
  createGroupRef: RefObject<BottomSheetRef>;
  isFetchedInitiallyRef: MutableRefObject<boolean>;
  listsOfAddressGroup: CacheableAccountList[];

  onChangeListsOfAddressGroup: (payload: CacheableAccountList[]) => void;
}

export const useListsStore = () => {
  const createGroupRef = useRef<BottomSheetRef>(null);
  const isFetchedInitiallyRef = useRef<boolean>(false);

  return create<ListsStore>((set) => ({
    createGroupRef,
    isFetchedInitiallyRef,
    listsOfAddressGroup: [],

    onChangeListsOfAddressGroup: (payload: CacheableAccountList[]) => {
      set({ listsOfAddressGroup: payload });
    }
  }))();
};
