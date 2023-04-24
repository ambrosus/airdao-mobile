import React, { useEffect, useState } from 'react';
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
import { usePersonalList } from '@hooks/cache';
import { styles } from './styles';
import { OnboardingFloatButton } from '@components/templates/OnboardingFloatButton';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { FloatButton } from '@components/base/FloatButton';
// import { useNavigation } from '@react-navigation/native';
// import { ExploreTabNavigationProp } from '@appTypes';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { useNavigation } from '@react-navigation/native';

export const WalletsScreen = () => {
  const { data: ambTokenData } = useAMBPrice();
  const { status, handleStepChange } = useOnboardingStatus((v) => v);
  const { personalList } = usePersonalList();
  const ambBalance = personalList.reduce(
    (prev, curr) => prev + curr.ambBalance,
    0
  );
  const navigation = useNavigation();
  const USDBalance = ambBalance * (ambTokenData?.priceUSD || 0);

  const [isToolTipVisible, setIsToolTipVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsToolTipVisible(true), 1000);
  }, []);

  // const navigation = useNavigation<ExploreTabNavigationProp>();

  const onOnboardingStepChange = (nextStep: OnBoardingStatus) => {
    handleStepChange(nextStep);
    setIsToolTipVisible(false);
  };

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
      <OnboardingFloatButton
        FloatButtonTitle={'Add a Address'}
        isToolTipVisible={isToolTipVisible}
        status={status}
        isIconVisible={true}
        handleStepChange={onOnboardingStepChange}
      >
        <FloatButton
          title="Add a Address"
          onPress={() => navigation.navigate('Explore')}
          icon={<AddIcon />}
        />
      </OnboardingFloatButton>
    </View>
  );
};
