import React, { useState } from 'react';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { TextInput } from 'react-native';
import { GraphPoint } from 'react-native-graph';
import { CMCInterval } from '@appTypes';
import { Button, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon, LogoGradient } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useAMBPrice, useAMBPriceHistorical } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { Badge } from '@components/base/Badge';
import { PercentChange } from '@components/composite';
import { BezierChart } from '../BezierChart';
import { styles } from './styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AMBPriceHistoryProps {
  badgeType: 'view' | 'button';
  onBadgePress?: () => unknown;
}

export const AMBPriceHistory = (props: AMBPriceHistoryProps) => {
  const { badgeType, onBadgePress } = props;
  const { data: ambPriceNow } = useAMBPrice();
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

  const chartData: GraphPoint[] = historicalAMBPrice.map((token, idx) => {
    return {
      date: new Date(token.timestamp.getTime() + idx),
      value: token.priceUSD
    };
  });

  return (
    <>
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
      <Button
        style={styles.badge}
        disabled={badgeType !== 'button'}
        onPress={onBadgePress}
      >
        <Badge
          icon={
            <Row alignItems="center" style={styles.balanceLast24HourChange}>
              <PercentChange
                change={ambPriceNow?.percentChange24H || 0}
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
              {badgeType === 'button' && (
                <>
                  <Spacer horizontal value={scale(4)} />
                  <ChevronRightIcon color={COLORS.smokyBlack} />
                </>
              )}
            </Row>
          }
        />
      </Button>
      <Spacer value={verticalScale(34)} />
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
    </>
  );
};
