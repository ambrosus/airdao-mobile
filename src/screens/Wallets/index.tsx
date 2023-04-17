import React from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  LearnAboutAirDAO,
  PortfolioBalance,
  Wallets,
  Watchlists
} from './components';
import { styles } from './styles';
import { useAMBPrice } from '@hooks/query';
import { PopUpOnBoarding } from '@components/composite/PopUpOnBoarding';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';

export const WalletsScreen = () => {
  const { data } = useAMBPrice();
  const { status, handleStepChange } = useOnboardingStatus((v) => v);

  return (
    <View style={{ flex: 1 }}>
      {status === 'step-1' ? (
        <PopUpOnBoarding step="step-2" handleStepChange={handleStepChange} />
      ) : null}

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="light" backgroundColor="#222222" />
        <PortfolioBalance
          USDBalance={3900}
          AMBBalance={1}
          balanceLast24HourChange={3.46}
          AMBPriceLast24HourChange={data?.percentChange24H || NaN}
          AMBPrice={data?.priceUSD || NaN}
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
    </View>
  );
};
