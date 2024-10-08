import React from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { AnimatedTabs } from '@components/modular';
import { BuyBondTab } from './tabs/buy-bond';
import { MarketType } from '@features/kosmos/types';
import { TransactionsHistoryTab } from './tabs/transactions';

interface ExactMarketTokenTabsProps {
  market: MarketType | undefined;
  scrollToInput: () => any;
}

export const ExactMarketTokenTabs = ({
  market,
  scrollToInput
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
          view: <BuyBondTab market={market} scrollToInput={scrollToInput} />
        },
        {
          title: t('kosmos.market.tabs.history'),
          view: <TransactionsHistoryTab market={market} />
        }
      ]}
    />
  );
};
