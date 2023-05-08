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
import { useAMBPrice } from '@hooks/query';
import { useOnboardingStatus } from '@contexts';
import { usePersonalList } from '@hooks/cache';
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
  const { start: startOnboarding, registerHelpers } = useOnboardingStatus(
    (v) => v
  );
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
        registerHelpers({ next: navigateToExplore });
        if (!onboardinStarted.current) {
          onboardinStarted.current = true;
          startOnboarding();
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
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
            <View style={styles.airdao}>
              <LearnAboutAirDAO />
            </View>
          )}
        </View>
      </ScrollView>
      <OnboardingView
        type="float"
        thisStep={1}
        tooltipPlacement="top"
        contentStyle={{ minHeight: 136 }}
      >
        <Row
          alignItems="center"
          justifyContent="center"
          style={styles.addAddressBtn}
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
