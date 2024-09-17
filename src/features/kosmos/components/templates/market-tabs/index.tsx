import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedTabs } from '@components/modular';
import { MarketsList } from '@/features/kosmos/components/composite';
import { WrappedListsContainer } from '@features/kosmos/components/base';
import { FiltersState } from '@features/kosmos/types';
import { UserOrdersList } from '@features/kosmos/components/modular';

interface MarketsTabsProps {
  changeActiveIndex: Dispatch<SetStateAction<number>>;
  filters: FiltersState;
}

export const MarketsTabs = ({
  changeActiveIndex,
  filters
}: MarketsTabsProps) => {
  const { t } = useTranslation();

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
          title: t('kosmos.primary.tabs.market'),
          view: (
            <WrappedListsContainer table>
              <MarketsList filters={filters} />
            </WrappedListsContainer>
          )
        },
        {
          title: t('kosmos.primary.tabs.orders'),
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
