import React, { useCallback, useState } from 'react';
import { InteractionManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { AnimatedTabs } from '@components/modular';
import { BuyBondTab } from './tabs/buy-bond';
import { MarketType } from '@features/kosmos/types';
import { TransactionsHistoryTab } from './tabs/transactions';
import { DEVICE_HEIGHT } from '@constants/variables';

interface ExactMarketTokenTabsProps {
  market: MarketType;
  onScrollToBuyBondsField: () => void;
  scrollVerticalAxis: number;
}

export const ExactMarketTokenTabs = ({
  market,
  onScrollToBuyBondsField,
  scrollVerticalAxis
}: ExactMarketTokenTabsProps) => {
  const { t } = useTranslation();
  const [currentFocusedIndex, setCurrentFocusedIndex] = useState(0);

  const onChangedIndex = useCallback(
    (index: number) => {
      setCurrentFocusedIndex(index);

      if (index === 0 && scrollVerticalAxis > DEVICE_HEIGHT)
        InteractionManager.runAfterInteractions(onScrollToBuyBondsField);
    },
    [onScrollToBuyBondsField, scrollVerticalAxis]
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
