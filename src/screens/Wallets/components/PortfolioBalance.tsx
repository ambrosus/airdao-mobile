import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { GraphPoint } from 'react-native-graph';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '@utils/scaling';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ChevronRightIcon, LogoGradient } from '@components/svg/icons';
import { BezierChart } from '@components/templates';
import { Badge } from '@components/base/Badge';
import { CMCInterval, WalletsNavigationProp } from '@appTypes';
import { PercentChange } from '@components/composite';
import { useAMBPriceHistorical, useInitialMountEffect } from '@hooks';

import { shadow } from '@constants/shadow';

interface PortfolioBalanceProps {
  AMBPrice: number;
  AMBPriceLast24HourChange: number; // TODO there is actually no percent change coming from API
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function PortfolioBalance(props: PortfolioBalanceProps): JSX.Element {
  const { AMBPrice, AMBPriceLast24HourChange } = props;
  const navigation = useNavigation<WalletsNavigationProp>();
  const [selectedInterval, setSelectedInverval] = useState<CMCInterval>('1h');
  const { data: historicalAMBPrice } = useAMBPriceHistorical(selectedInterval);
  const ambPrice = useSharedValue(0);
  const formattedPrice = useDerivedValue(() => {
    return ambPrice.value.toFixed(6);
  }, [ambPrice.value]);
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `$${formattedPrice.value.toString()}`
    } as any;
  });

  useInitialMountEffect(() => {
    ambPrice.value = AMBPrice;
  }, !Number.isNaN(AMBPrice));

  const chartData: GraphPoint[] = historicalAMBPrice.map((token, idx) => {
    return {
      date: new Date(token.timestamp.getTime() + idx),
      value: token.priceUSD
    };
  });

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

  return (
    <View style={styles.container} testID="portfolio-balance">
      <Row alignItems="center" justifyContent="center">
        <LogoGradient />
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
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          value={formattedPrice.value}
          {...{ animatedProps }}
          style={{
            fontSize: 30,
            fontFamily: 'Mersad_600SemiBold',
            color: COLORS.jetBlack
          }}
        />
      </Row>
      <Spacer value={scale(16)} />
      <Button style={styles.badge} onPress={navigateToAMBScreen}>
        <Badge
          icon={
            <Row alignItems="center" style={styles.balanceLast24HourChange}>
              <PercentChange
                change={AMBPriceLast24HourChange}
                fontSize={16}
                fontWeight="500"
              />
              <Spacer horizontal value={scale(4)} />
              <Text
                fontFamily="Inter_500Medium"
                fontSize={14}
                color={COLORS.smokyBlack}
              >
                (24hr)
              </Text>
              <Spacer horizontal value={scale(4)} />
              <ChevronRightIcon color={COLORS.smokyBlack} />
            </Row>
          }
        />
      </Button>
      <BezierChart
        intervals={[
          {
            text: '1H',
            value: '1h'
          },
          {
            text: '1D',
            value: '1d'
          },
          {
            text: '1W',
            value: 'weekly'
          },
          {
            text: '1M',
            value: 'monthly'
          }
        ]}
        selectedInterval={{ value: selectedInterval, text: '' }}
        data={chartData}
        axisLabelColor={COLORS.smokyBlack}
        strokeColor={COLORS.chartGreen}
        axisColor="transparent"
        onPointSelected={(point) => {
          if (point) {
            ambPrice.value = point.value;
          }
        }}
        onIntervalSelected={(interval) =>
          setSelectedInverval(interval.value as CMCInterval)
        }
      />
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
