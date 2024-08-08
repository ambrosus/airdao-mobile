import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [currentFocusedIndex, setCurrentFocusedIndex] = useState(0);

  const onChangedIndex = useCallback(
    (index: number) => {
      setCurrentFocusedIndex(index);

      if (index === 0) onScrollToEnd();
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
          title: t('kosmos.market.tabs.buy.bond'),
          view: <BuyBondTab market={market} />
        },
        {
          title: t('kosmos.market.tabs.history'),
          view: (
            <TransactionsHistoryTab
              focused={currentFocusedIndex === 1}
              market={market}
            />
          )
        }
      ]}
    />
  );
};
