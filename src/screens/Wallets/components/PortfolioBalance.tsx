import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { AMBPriceHistory } from '@components/templates';
import { WalletsNavigationProp } from '@appTypes';
import { shadow } from '@constants/shadow';

export function PortfolioBalance(): JSX.Element {
  const navigation = useNavigation<WalletsNavigationProp>();

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

  return (
    <View style={styles.container} testID="Portfolio_Balance">
      <AMBPriceHistory onBadgePress={navigateToAMBScreen} badgeType="button" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(36),
    paddingBottom: verticalScale(32),
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
    marginTop: verticalScale(16),
    alignSelf: 'center'
  },
  balanceAction: {
    backgroundColor: '#FFFFFF1A',
    width: scale(24),
    height: scale(24),
    marginLeft: scale(16)
  },
  balanceLast24HourChange: {
    marginHorizontal: scale(12)
  }
});
