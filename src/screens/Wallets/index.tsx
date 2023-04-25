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
import { useNavigation } from '@react-navigation/native';
import { ExploreTabNavigationProp } from '@appTypes';

export const WalletsScreen = () => {
  const { data: ambTokenData } = useAMBPrice();
  const { status, handleStepChange } = useOnboardingStatus((v) => v);
  const { personalList } = usePersonalList();
  const ambBalance = personalList.reduce(
    (prev, curr) => prev + curr.ambBalance,
    0
  );
  const USDBalance = ambBalance * (ambTokenData?.priceUSD || 0);

  const [isToolTipVisible, setIsToolTipVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsToolTipVisible(true), 1000);
  }, []);

  const navigation = useNavigation<ExploreTabNavigationProp<'Explore'>>();

  const handleOnboardingStepChange = () => {
    handleStepChange('step-2');
    setIsToolTipVisible(false);
    setTimeout(() => navigation.navigate('Explore'), 300);
  };

  const handleOnFloatButtonPress = () => {
    setIsToolTipVisible(false);
    navigation.navigate('Explore');
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
        setIsToolTipVisible={setIsToolTipVisible}
        onboardingButtonTitle="Add a Address"
        isToolTipVisible={isToolTipVisible}
        status={status}
        onboardingButtonIcon={<AddIcon />}
        handleOnboardingStepChange={handleOnboardingStepChange}
      >
        <FloatButton
          title="Add a Address"
          onPress={handleOnFloatButtonPress}
          icon={<AddIcon />}
        />
      </OnboardingFloatButton>
    </View>
  );
};
