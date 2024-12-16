import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { AnimatedTabs } from '@components/modular';
import { BuyBondTab } from './tabs/buy-bond';
import { TransactionsHistoryTab } from './tabs/transactions';
import { MarketType } from '@entities/kosmos';

interface ExactMarketTokenTabsProps {
  market: MarketType | undefined;
  scrollToInput: () => any;
  calculateMaximumAvailableAmount: (balance: string) => void;
  userPerformedRefresh: boolean;
  onScrollToTop: () => void;
  onHandleBuyBondsLayoutChange: (event: LayoutChangeEvent) => void;
}

export const ExactMarketTokenTabs = ({
  market,
  scrollToInput,
  calculateMaximumAvailableAmount,
  userPerformedRefresh,
  onScrollToTop,
  onHandleBuyBondsLayoutChange
}: ExactMarketTokenTabsProps) => {
  const { t } = useTranslation();

  return (
    <AnimatedTabs
      keyboardShouldPersistTaps="handled"
      dismissOnChangeIndex
      containerStyle={styles.container}
      tabs={[
        {
          title: t('kosmos.market.tabs.buy.bond'),
          view: (
            <BuyBondTab
              onHandleBuyBondsLayoutChange={onHandleBuyBondsLayoutChange}
              userPerformedRefresh={userPerformedRefresh}
              calculateMaximumAvailableAmount={calculateMaximumAvailableAmount}
              market={market}
              scrollToInput={scrollToInput}
              onScrollToTop={onScrollToTop}
            />
          )
        },
        {
          title: t('kosmos.market.tabs.history'),
          view: <TransactionsHistoryTab market={market} />
        }
      ]}
    />
  );
};
