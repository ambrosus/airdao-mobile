import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { AMBPriceHistory } from '@components/templates';
import { WalletsNavigationProp } from '@appTypes';
import { useInitialMountEffect } from '@hooks';
import { shadow } from '@constants/shadow';

interface PortfolioBalanceProps {
  AMBPrice: number;
  AMBPriceLast24HourChange: number; // TODO there is actually no percent change coming from API
}

export function PortfolioBalance(props: PortfolioBalanceProps): JSX.Element {
  const { AMBPrice } = props;
  const navigation = useNavigation<WalletsNavigationProp>();
  const ambPrice = useSharedValue(0);

  useInitialMountEffect(() => {
    ambPrice.value = AMBPrice;
  }, !Number.isNaN(AMBPrice));

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

  console.log(chartData[49]);

  return (
    <View style={styles.container} testID="portfolio-balance">
      <AMBPriceHistory onBadgePress={navigateToAMBScreen} badgeType="button" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(37),
    paddingBottom: verticalScale(29),
    backgroundColor: COLORS.white,
    borderRadius: 24,
    alignItems: 'center',
    ...shadow
  },
  badge: {
    width: '40%',
    alignSelf: 'center'
  },
  balance: {
    marginTop: verticalScale(17),
    alignSelf: 'center'
  },
  balanceAction: {
    backgroundColor: '#FFFFFF1A',
    width: scale(24),
    height: scale(24),
    marginLeft: scale(14)
  },
  balanceLast24HourChange: {
    marginHorizontal: scale(13)
  }
});
