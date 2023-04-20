import React from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  LearnAboutAirDAO,
  PortfolioBalance,
  Wallets,
  Watchlists
} from './components';
import { useAMBPrice } from '@hooks/query';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';
import { WalletsFloatButton } from '@screens/Wallets/components/WalletsFloatButton';
import { usePersonalList } from '@hooks/cache';
import { styles } from './styles';

export const WalletsScreen = () => {
  const { data: ambTokenData } = useAMBPrice();
  const { status, handleStepChange } = useOnboardingStatus((v) => v);
  const { personalList } = usePersonalList();
  const ambBalance = personalList.reduce(
    (prev, curr) => prev + curr.ambBalance,
    0
  );
  const USDBalance = ambBalance * (ambTokenData?.priceUSD || 0);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="light" backgroundColor="#222222" />
        <PortfolioBalance
          USDBalance={USDBalance}
          AMBBalance={ambBalance}
          balanceLast24HourChange={3.46}
          AMBPriceLast24HourChange={ambTokenData?.percentChange24H || NaN}
          AMBPrice={ambTokenData?.priceUSD || NaN}
        />
        <View style={styles.content}>
          <Wallets />
          <View style={styles.divider} />
          <Watchlists />
          <View style={styles.airdao}>
            <LearnAboutAirDAO />
          </View>
        </View>
      </ScrollView>
      <WalletsFloatButton status={status} handleStepChange={handleStepChange} />
    </View>
  );
};
