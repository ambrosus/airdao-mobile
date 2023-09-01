import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { GraphPoint } from 'react-native-graph';
import { CMCInterval } from '@appTypes';
import { AnimatedText, Button, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon, LogoGradientCircular } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useAMBPrice, useAMBPriceHistorical } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { Badge } from '@components/base/Badge';
import { PercentChange } from '@components/composite';
import { BezierChart } from '../BezierChart';
import { MONTH_NAMES } from '@constants/variables';
import { styles } from './styles';

interface AMBPriceHistoryProps {
  badgeType: 'view' | 'button';
  defaultInterval?: '1d' | 'weekly' | 'monthly';
  onBadgePress?: () => unknown;
}

// @ts-ignore
const intervalTimeDiffMap: { [key in CMCInterval]: number } = {
  // '1h': 3.6 * 10e5,
  '1d': 8.64 * 10e6,
  'weekly': 6.048 * 10e7,
  'monthly': 2.628 * 10e8
};

export const AMBPriceHistory = (props: AMBPriceHistoryProps) => {
  const { badgeType, defaultInterval = '1d', onBadgePress } = props;
  const { data: ambPriceNow } = useAMBPrice();
  const ambPriceNowRef = useRef(ambPriceNow?.priceUSD);
  const [selectedInterval, setSelectedInverval] =
    useState<CMCInterval>(defaultInterval);
  const { data: historicalAMBPrice } = useAMBPriceHistorical(selectedInterval);
  const ambPrice = useSharedValue(ambPriceNow?.priceUSD || 0);
  const selectedPointDate = useSharedValue(-1);
  const didSetAMBPriceFromAPI = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (ambPriceNow) {
      ambPriceNowRef.current = ambPriceNow.priceUSD;
      ambPrice.value = ambPriceNow.priceUSD;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambPriceNow, didSetAMBPriceFromAPI.current]);

  const historicalAMBPriceWithInterval = useMemo(() => {
    const diff = intervalTimeDiffMap[selectedInterval];
    return historicalAMBPrice.filter(
      (token) => new Date().getTime() - token.timestamp.getTime() <= diff
    );
  }, [historicalAMBPrice, selectedInterval]);
  const formattedPrice = useDerivedValue(() => {
    return `$${ambPrice.value.toFixed(6)}`;
  }, [ambPrice.value]);

  const chartData: GraphPoint[] = historicalAMBPriceWithInterval.map(
    (token) => {
      return {
        date: new Date(token.timestamp.getTime()),
        value: token.priceUSD
      };
    }
  );

  const priceAnimatedProps = useAnimatedProps(() => {
    return {
      text: `$${ambPrice.value.toFixed(6).toString()}`
    } as any;
  });

  const animatedDate = useDerivedValue(() => {
    return '';
  });

  const dateAnimatedProps = useAnimatedProps(() => {
    if (selectedPointDate.value !== -1) {
      // format date
      const now = new Date();
      const selectedDate = new Date(selectedPointDate.value);
      const isToday = now.toDateString() === selectedDate.toDateString();
      let formattedDate = '';
      const hours =
        selectedDate.getHours() % 12 >= 10
          ? selectedDate.getHours() % 12
          : `0${selectedDate.getHours() % 12}`;
      const meridiem = selectedDate.getHours() > 12 ? 'pm' : 'am';
      const minutes =
        selectedDate.getMinutes() >= 10
          ? selectedDate.getMinutes()
          : `0${selectedDate.getMinutes()}`;
      if (isToday) {
        formattedDate = `${hours}:${minutes} ${meridiem}`;
      } else {
        const month = MONTH_NAMES[selectedDate.getMonth()];
        const date =
          selectedDate.getDate() >= 10
            ? selectedDate.getDate()
            : `0${selectedDate.getDate()}`;
        formattedDate = `${month} ${date} ${hours}:${minutes} ${meridiem}`;
      }
      return {
        text: formattedDate
      } as any;
    }
    return {
      text: ''
    };
  });

  const animatedDateContainerStyles = useAnimatedStyle(() => {
    return {
      marginLeft:
        selectedPointDate.value !== -1 ? withTiming(8) : withTiming(-24),
      opacity: selectedPointDate.value !== -1 ? withTiming(1) : withTiming(0)
    };
  }, [selectedInterval]);

  return (
    <View testID="AMB_Price_History" style={{ alignItems: 'center' }}>
      <Row style={styles.balance} testID="Formatted_Price">
        <AnimatedText
          value={formattedPrice}
          animatedProps={priceAnimatedProps}
          style={{
            fontSize: 30,
            fontFamily: 'Mersad_600SemiBold',
            color: COLORS.jetBlack
          }}
        />
      </Row>
      <Row alignItems="center">
        <Button
          style={styles.badge}
          disabled={badgeType !== 'button'}
          onPress={onBadgePress}
          testID="Badge_Button"
        >
          <Badge
            color="transparent"
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
                  {selectedInterval && '24hrs'}
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
        <Animated.View style={animatedDateContainerStyles}>
          <AnimatedText
            value={animatedDate}
            animatedProps={dateAnimatedProps}
            style={{
              fontSize: 12,
              fontFamily: 'Inter_500Medium',
              color: COLORS.asphalt
            }}
          />
        </Animated.View>
      </Row>
      <Spacer value={verticalScale(34)} />
      <BezierChart
        intervals={[
          // {
          //   text: '1H',
          //   value: '1h'
          // },
          {
            text: t('chart.timeframe.daily'),
            value: '1d'
          },
          {
            text: t('chart.timeframe.weekly'),
            value: 'weekly'
          },
          {
            text: t('chart.timeframe.monthly'),
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
            selectedPointDate.value = point.date.getTime();
          } else {
            ambPrice.value = ambPriceNowRef.current || 0;
            selectedPointDate.value = -1;
          }
        }}
        onIntervalSelected={(interval) =>
          setSelectedInverval(interval.value as CMCInterval)
        }
      />
    </View>
  );
};
