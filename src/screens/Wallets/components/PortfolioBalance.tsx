import React, { useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { moderateScale, scale, verticalScale } from '../../../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WalletHeader } from './Header';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  EyeVisibleIcon,
  RightArrowIcon,
  ShareIcon,
  TrendIcon
} from '@components/svg/icons';
import { NumberUtils } from '../../../utils/number';

interface PortfolioBalanceProps {
  USDBalance: number;
  AMBBalance: number;
  AMBPrice: number;
  balanceLast24HourChange: number;
  AMBPriceLast24HourChange: number;
}

export function PortfolioBalance(props: PortfolioBalanceProps): JSX.Element {
  const {
    USDBalance,
    AMBBalance,
    balanceLast24HourChange,
    AMBPriceLast24HourChange,
    AMBPrice
  } = props;
  const safeAreaInsets = useSafeAreaInsets();
  const [balanceVisible, toggleBalanceVisibility] = useReducer(
    (visible) => !visible,
    true
  );

  const onShareBalancePress = () => {
    // TODO
  };

  const navigateToStats = () => {
    // TODO
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <WalletHeader />
      <View style={styles.content}>
        <Text fontFamily="Inter_500Medium" color="#828282">
          My Wallet Value
        </Text>
        <Row alignItems="center" style={styles.balance}>
          <Text color={COLORS.white} heading fontFamily="Mersad_600SemiBold">
            $
            {balanceVisible
              ? NumberUtils.formatNumber(USDBalance)
              : NumberUtils.formatNumber(USDBalance)
                  .split('')
                  .map((ch) => (ch === '.' ? ch : '*'))
                  .join('')}
          </Text>
          {USDBalance > 0 && (
            <Row alignItems="center" flex={1}>
              <Button
                onPress={toggleBalanceVisibility}
                type="circular"
                style={styles.balanceAction}
              >
                <EyeVisibleIcon size={scale(10)} />
              </Button>
              <Button
                onPress={onShareBalancePress}
                type="circular"
                style={styles.balanceAction}
              >
                <ShareIcon size={scale(13)} />
              </Button>
            </Row>
          )}
        </Row>
        <Row alignItems="center" style={styles.ambBalance}>
          <Text color={COLORS.white}>
            {NumberUtils.formatNumber(AMBBalance)} AMB
          </Text>
          <Row alignItems="center" style={styles.balanceLast24HourChange}>
            <TrendIcon color={COLORS.lightGrey} size={12} />
            <Text color={COLORS.lightGrey}>
              {'  '}
              {NumberUtils.formatNumber(balanceLast24HourChange)}%
            </Text>
          </Row>
        </Row>
        <View
          style={[
            styles.chart,
            { height: verticalScale(110), backgroundColor: 'red' }
          ]}
        >
          <Text color="#FFFFFF">Chart</Text>
        </View>
        <Button
          type="bordered"
          borderRadius={scale(15)}
          style={styles.stats}
          borderColor="rgba(255, 255, 255, 0.1)"
          onPress={navigateToStats}
        >
          <Row flex={1} alignItems="center" justifyContent="space-between">
            <Row alignItems="center">
              <Text subtitle fontSize={15} color={COLORS.white}>
                AMB PRICE: ${AMBPrice}
              </Text>
              <Text color={COLORS.lightGrey}>
                {'  ' +
                  (AMBPriceLast24HourChange > 0
                    ? '+'
                    : AMBPriceLast24HourChange < 0
                    ? '-'
                    : '')}
                {NumberUtils.formatNumber(AMBPriceLast24HourChange)}%
              </Text>
            </Row>
            <Row alignItems="center">
              <Text color={COLORS.white}>See Stats {'  '}</Text>
              <RightArrowIcon />
            </Row>
          </Row>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '50%',
    backgroundColor: '#222222',
    borderBottomLeftRadius: scale(28),
    borderBottomRightRadius: scale(28),
    paddingBottom: verticalScale(20)
  },
  content: {
    paddingHorizontal: '5%',
    marginTop: verticalScale(20)
  },
  balance: {
    marginTop: verticalScale(12)
  },
  balanceAction: {
    backgroundColor: '#FFFFFF1A',
    width: scale(24),
    height: scale(24),
    marginLeft: scale(14)
  },
  ambBalance: {
    marginTop: verticalScale(12)
  },
  balanceLast24HourChange: {
    marginLeft: scale(14)
  },
  chart: {
    marginTop: verticalScale(8)
  },
  stats: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
    borderRadius: moderateScale(15),
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  }
});
