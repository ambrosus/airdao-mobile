import React, { useReducer, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from './Header';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  EyeInvisibleIcon,
  EyeVisibleIcon,
  ShareIcon
} from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { BezierChart, Point, SharePortfolio } from '@components/templates';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes/navigation';
import { Badge } from '@components/base/Badge';
import { AirDAOLogo } from '@components/svg/icons/AirDAOLogo';

interface PortfolioBalanceProps {
  USDBalance: number;
  AMBBalance: number;
  AMBPrice: number;
  balanceLast24HourChange: number;
  AMBPriceLast24HourChange: number; // TODO there is actually no percent change coming from API
}

export function PortfolioBalance(props: PortfolioBalanceProps): JSX.Element {
  const {
    USDBalance,
    AMBBalance,
    balanceLast24HourChange,
    AMBPriceLast24HourChange,
    AMBPrice
  } = props;
  const navigation = useNavigation<WalletsNavigationProp>();
  const safeAreaInsets = useSafeAreaInsets();
  const [balanceVisible, toggleBalanceVisibility] = useReducer(
    (visible) => !visible,
    true
  );

  const shareBottomSheet = useRef<BottomSheetRef>(null);

  const chartData: Point[] = [];

  const onShareBalancePress = () => {
    shareBottomSheet.current?.show();
  };

  const navigateToStats = () => {
    navigation.navigate('AMBMarketScreen');
  };

  return (
    <View
      style={[styles.container, { paddingTop: safeAreaInsets.top }]}
      testID="portfolio-balance"
    >
      <HomeHeader />
      <View style={styles.content}>
        <Spacer value={scale(38)} />
        <Row alignItems="center" justifyContent="center">
          <AirDAOLogo />
          <Spacer horizontal value={scale(10)} />
          <Text
            align="center"
            fontFamily="Inter_600SemiBold"
            fontSize={15}
            color={COLORS.smokyBlack}
          >
            AirDAO (AMB)
          </Text>
        </Row>
        <Row style={styles.balance}>
          <Text
            color={COLORS.smokyBlack}
            heading
            fontFamily="Mersad_600SemiBold"
            fontSize={30}
            testID="Portfolio_Balance_Title"
          >
            $
            {balanceVisible
              ? NumberUtils.formatNumber(USDBalance)
              : NumberUtils.formatNumber(USDBalance)
                  .split('')
                  .map((ch) => (ch === '.' ? ch : '*'))
                  .join('')}
          </Text>
          {USDBalance > 0 && (
            <Row
              alignItems="center"
              flex={1}
              testID="Portfolio_Balance_USDBalance"
            >
              <Button
                onPress={toggleBalanceVisibility}
                type="circular"
                style={styles.balanceAction}
              >
                {balanceVisible ? <EyeInvisibleIcon /> : <EyeVisibleIcon />}
              </Button>
              <Button
                onPress={onShareBalancePress}
                type="circular"
                style={styles.balanceAction}
              >
                <ShareIcon color={COLORS.smokyBlack} />
              </Button>
            </Row>
          )}
        </Row>
        <Spacer value={scale(16)} />
        <View style={{ width: '50%', alignSelf: 'center' }}>
          <Badge
            icon={
              <Row alignItems="center" style={styles.balanceLast24HourChange}>
                <Text color={COLORS.jungleGreen}>
                  + {NumberUtils.formatNumber(balanceLast24HourChange)}%
                </Text>
                <Spacer horizontal value={scale(4)} />
                <Text>(24hr)</Text>
              </Row>
            }
          />
        </View>
        <View style={styles.chart}>
          <BezierChart
            height={verticalScale(200)}
            data={chartData}
            axisLabelColor={COLORS.smokyBlack}
            strokeColor={COLORS.jungleGreen}
            axisColor="transparent"
          />
        </View>
      </View>
      <SharePortfolio
        ref={shareBottomSheet}
        balance={NumberUtils.formatNumber(AMBBalance, 0)}
        currency="AMB"
        currencyPosition="right"
        last24HourChange={3.46}
        title="My portfolio performance"
        bottomSheetTitle="Share Portfolio Performance"
        timestamp={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height * 0.5,
    backgroundColor: '#f3f5f7'
    // backgroundColor: 'red',
    // borderBottomLeftRadius: scale(28),
    // borderBottomRightRadius: scale(28),
    // paddingBottom: verticalScale(20)
  },
  content: {
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 20
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
  ambBalance: {
    marginTop: verticalScale(12)
  },
  balanceLast24HourChange: {
    marginHorizontal: scale(13)
  },
  chart: {
    // marginTop: verticalScale(8)
  },
  stats: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
    borderRadius: moderateScale(15),
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  }
});
