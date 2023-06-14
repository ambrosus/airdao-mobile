import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PortfolioBalance } from './components';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { useOnboardingStatus } from '@contexts';
import { useAMBPrice } from '@hooks';
import { SearchTabNavigationProp } from '@appTypes';
import { styles } from './styles';
import { OnboardingView } from '@components/templates/OnboardingView';
import { Row, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { HomeTabs } from '@screens/Wallets/components/HomeTabs/HomeTabs';
// import { HomeHighlights } from '@screens/Wallets/components/HomeHighlightsSlider/HomeHighlights';
import { HomeHeader } from '@screens/Wallets/components/Header';

export const HomeScreen = () => {
  const navigation = useNavigation<SearchTabNavigationProp>();
  const isFocused = useIsFocused();

  const { data: ambTokenData } = useAMBPrice();
  const { start: startOnboarding } = useOnboardingStatus((v) => v);
  const onboardinStarted = useRef(false);

  const navigateToSearch = useCallback(() => {
    navigation.navigate('Search', { screen: 'SearchScreen' });
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
    <View
      style={{ flex: 1, backgroundColor: '#f3f5f7' }}
      testID="Wallets_Screen"
    >
      <HomeHeader />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: scale(16) }}>
          <PortfolioBalance
            AMBPriceLast24HourChange={ambTokenData?.percentChange24H || NaN}
            AMBPrice={ambTokenData?.priceUSD || NaN}
          />
        </View>
        <Spacer value={verticalScale(24)} />
        <View style={styles.homeTabs}>
          <HomeTabs />
        </View>
        {/*<Spacer value={scale(24)} />*/}
        {/*<View style={styles.homeHighlights}>*/}
        {/*  <HomeHighlights />*/}
        {/*</View>*/}
      </ScrollView>
      <OnboardingView
        type="float"
        thisStep={1}
        tooltipPlacement="top"
        helpers={{
          next: navigateToSearch
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
