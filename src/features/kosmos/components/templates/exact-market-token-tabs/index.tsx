import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { AnimatedTabs } from '@components/modular';
import { BuyBondTab } from './tabs/buy-bond';
import { MarketType } from '@features/kosmos/types';

interface ExactMarketTokenTabsProps {
  market: MarketType;
}

export const ExactMarketTokenTabs = ({ market }: ExactMarketTokenTabsProps) => {
  return (
    <AnimatedTabs
      containerStyle={styles.container}
      tabs={[
        {
          title: 'Buy bond',
          view: <BuyBondTab market={market} />
        },
        {
          title: 'History',
          view: <View style={{ flex: 1, backgroundColor: 'yellow' }} />
        }
      ]}
    />
  );
};
