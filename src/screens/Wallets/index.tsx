import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  LearnAboutAirDAO,
  PortfolioBalance,
  Wallets,
  Watchlists
} from './components';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { useOnboardingStatus } from '@contexts';
import { usePersonalList, useAMBPrice } from '@hooks';
import { ExploreTabNavigationProp } from '@appTypes';
import { styles } from './styles';
import { OnboardingView } from '@components/templates/OnboardingView';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const WalletsScreen = () => {
  const navigation = useNavigation<ExploreTabNavigationProp>();
  const isFocused = useIsFocused();

  const { data: ambTokenData } = useAMBPrice();
  const { start: startOnboarding } = useOnboardingStatus((v) => v);
  const { personalList } = usePersonalList();
  const ambBalance = personalList.reduce(
    (prev, curr) => prev + curr.ambBalance,
    0
  );

  const USDBalance = ambBalance * (ambTokenData?.priceUSD || 0);
  const onboardinStarted = useRef(false);

  const navigateToExplore = useCallback(() => {
    navigation.navigate('Explore', { screen: 'ExploreScreen' });
  }, [navigation]);

  useLayoutEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        if (!onboardinStarted.current) {
          onboardinStarted.current = true;
          startOnboarding();
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }} testID="wallets-screen">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
          {Platform.OS === 'ios' && (
            <View testID="learn-about-airdao" style={styles.airdao}>
              <LearnAboutAirDAO />
            </View>
          )}
        </View>
      </ScrollView>
      <OnboardingView
        type="float"
        thisStep={1}
        tooltipPlacement="top"
        helpers={{
          next: navigateToExplore
        }}
        removeAndroidStatusBarHeight
      >
        <Row
          alignItems="center"
          justifyContent="center"
          style={styles.addAddressBtn}
          testID="onboarding-float-button"
        >
          <AddIcon />
          <Spacer horizontal value={scale(10.5)} />
          <Text title fontFamily="Inter_600SemiBold" color={COLORS.white}>
            Add an Address
          </Text>
        </Row>
      </OnboardingView>
    </View>
  );
};
