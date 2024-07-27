import React, { useCallback } from 'react';
import { styles } from './styles';
import { AnimatedTabs } from '@components/modular';
import { BuyBondTab } from './tabs/buy-bond';
import { MarketType } from '@features/kosmos/types';
import { TransactionsHistoryTab } from './tabs/transactions';

interface ExactMarketTokenTabsProps {
  market: MarketType;
  onScrollToEnd: () => void;
}

export const ExactMarketTokenTabs = ({
  market,
  onScrollToEnd
}: ExactMarketTokenTabsProps) => {
  const onChangedIndex = useCallback(
    (index: number) => {
      if (index === 1) onScrollToEnd();
    },
    [onScrollToEnd]
  );

  return (
    <AnimatedTabs
      keyboardShouldPersistTaps="handled"
      dismissOnChangeIndex
      onChangedIndex={onChangedIndex}
      containerStyle={styles.container}
      tabs={[
        {
          title: 'Buy bond',
          view: <BuyBondTab market={market} />
        },
        {
          title: 'History',
          view: <TransactionsHistoryTab market={market} />
        }
      ]}
    />
  );
};
