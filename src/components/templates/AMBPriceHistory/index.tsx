import React, { useEffect, useMemo, useRef, useState } from 'react';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import moment from 'moment';
import { GraphPoint } from 'react-native-graph';
import { CMCInterval } from '@appTypes';
import { AnimatedText, Button, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon, LogoGradient } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useAMBPrice, useAMBPriceHistorical } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { Badge } from '@components/base/Badge';
import { PercentChange } from '@components/composite';
import { BezierChart } from '../BezierChart';
import { styles } from './styles';

interface AMBPriceHistoryProps {
  badgeType: 'view' | 'button';
  onBadgePress?: () => unknown;
}

const intervalTimeDiffMap: { [key in CMCInterval]: number } = {
  // '1h': 3.6 * 10e5,
  '1d': 8.64 * 10e6,
  'weekly': 6.048 * 10e7,
  'monthly': 2.628 * 10e8
};

export const AMBPriceHistory = (props: AMBPriceHistoryProps) => {
  const { badgeType, onBadgePress } = props;
  const { data: ambPriceNow } = useAMBPrice();
  const ambPriceNowRef = useRef(ambPriceNow?.priceUSD);
  const [selectedInterval, setSelectedInverval] = useState<CMCInterval>('1d');
  const { data: historicalAMBPrice } = useAMBPriceHistorical(selectedInterval);
  const ambPrice = useSharedValue(ambPriceNow?.priceUSD || 0);
  const selectedPointDate = useSharedValue(-1);
  const [formattedDate, setFormattedDate] = useState('');
  const didSetAMBPriceFromAPI = useRef(false);

  useEffect(() => {
    if (ambPriceNow && !didSetAMBPriceFromAPI.current) {
      ambPriceNowRef.current = ambPriceNow.priceUSD;
      ambPrice.value = ambPriceNow.priceUSD;
      didSetAMBPriceFromAPI.current = true;
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

  const formatDate = (selectedPointDate: number) => {
    const now = moment();
    const isToday = moment(selectedPointDate).isSame(now, 'day');
    let formattedDate = '';
    if (isToday) formattedDate = moment(selectedPointDate).format('hh:mm A');
    else formattedDate = moment(selectedPointDate).format('MMMM DD hh:mm A');
    setFormattedDate(formattedDate);
  };

  const dateAnimatedProps = useAnimatedProps(() => {
    if (selectedPointDate.value !== -1) {
      runOnJS(formatDate)(selectedPointDate.value);
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
                  Today
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
    </>
  );
};
