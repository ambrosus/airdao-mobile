import React from 'react';
import { View } from 'react-native';
import dayjs from 'dayjs';
import { Row, Spacer, Text } from '@components/base';
import { LogoBigSVG, TrendIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { styles } from './styles';

export interface PortfolioPerformanceProps {
  balance: string;
  currency: string;
  currencyPosition: 'left' | 'right';
  last24HourChange: number;
  title: string;
  timestamp: Date;
}

export function PortfolioPerformance(
  props: PortfolioPerformanceProps
): JSX.Element {
  const {
    balance,
    currency,
    currencyPosition,
    last24HourChange,
    title,
    timestamp
  } = props;

  return (
    <View style={styles.container}>
      <Row>
        <View>
          <Text fontSize={16} color={COLORS.white}>
            {title}
          </Text>
          <View style={styles.balance}>
            <Text heading fontFamily="Mersad_600SemiBold" color={COLORS.white}>
              {currencyPosition === 'left' ? currency : ''}
              {balance}
              {currencyPosition === 'right' ? ' ' + currency : ''}
            </Text>
          </View>
          <Spacer value={verticalScale(16)} />
          <Row alignItems="center" justifyContent="space-between">
            <Text color="rgba(255, 255, 255, 0.5)">24H Change</Text>
            <Row alignItems="center">
              <TrendIcon color="#FFFFFF" />
              <Text color="#FFFFFF"> %{last24HourChange.toFixed(2)}</Text>
            </Row>
          </Row>
          <Spacer value={verticalScale(9)} />
          <Row alignItems="center" justifyContent="space-between">
            <Text subtext color="rgba(255, 255, 255, 0.5)">
              Time Stamp{' '}
            </Text>
            <Text subtext color="#FFFFFF">
              {dayjs(timestamp).format('YYYY-mm-DD')}
            </Text>
            <Text subtext color="#FFFFFF">
              {' '}
              {dayjs(timestamp).format('hh:mm A')}
            </Text>
          </Row>
        </View>
        <View style={styles.logo}>
          <View style={styles.logoEllipseOuter}>
            <View style={styles.logoEllipseMiddle}>
              <View style={styles.logoEllipseInner}>
                <LogoBigSVG />
              </View>
            </View>
          </View>
        </View>
      </Row>
    </View>
  );
}
