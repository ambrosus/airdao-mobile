import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { AnimatedTabs } from '@components/modular';
import {
  MarketsList,
  UserOrdersList
} from '@/features/kosmos/components/composite';
import { WrappedListsContainer } from '@features/kosmos/components/base';
import { FiltersState } from '@features/kosmos/types';

interface MarketsTabsProps {
  changeActiveIndex: Dispatch<SetStateAction<number>>;
  filters: FiltersState;
}

export const MarketsTabs = ({
  changeActiveIndex,
  filters
}: MarketsTabsProps) => {
  const onChangeActiveTabIndex = useCallback(
    (index: number) => {
      changeActiveIndex(index);
    },
    [changeActiveIndex]
  );

  return (
    <AnimatedTabs
      dismissOnChangeIndex
      keyboardShouldPersistTaps="handled"
      onChangedIndex={onChangeActiveTabIndex}
      containerStyle={{ height: '100%' }}
      tabs={[
        {
          title: 'Markets',
          view: (
            <WrappedListsContainer>
              <MarketsList filters={filters} />
            </WrappedListsContainer>
          )
        },
        {
          title: 'My orders',
          view: (
            <WrappedListsContainer>
              <UserOrdersList />
            </WrappedListsContainer>
          )
        }
      ]}
    />
  );
};
