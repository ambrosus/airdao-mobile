/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { ImageBackground, View } from 'react-native';
import dayjs from 'dayjs';
import { Row, Spacer, Text } from '@components/base';
import { LogoBigSVG, TrendIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';

export interface PortfolioPerformanceProps {
  balance: string;
  currency: string;
  currencyPosition: 'left' | 'right';
  last24HourChange?: number;
  txFee?: number;
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
    txFee,
    title,
    timestamp
  } = props;

  return (
    <ImageBackground
      source={require('../../../../assets/images/portfolio-perfomance.png')}
      resizeMode="cover"
      imageStyle={{ borderRadius: 16 }}
    >
      <View style={styles.container}>
        <Row>
          <View>
            <Text fontSize={16} color={COLORS.white}>
              {title}
            </Text>
            <View style={styles.balance}>
              <Text
                heading
                fontFamily="Mersad_600SemiBold"
                color={COLORS.white}
              >
                {currencyPosition === 'left' ? currency : ''}
                {balance}
                {currencyPosition === 'right' ? ' ' + currency : ''}
              </Text>
            </View>
            <Spacer value={verticalScale(16)} />
            {Object.hasOwn(props, 'last24HourChange') && (
              <>
                <Spacer value={verticalScale(9)} />
                <Row alignItems="center">
                  <Text color="rgba(255, 255, 255, 0.5)">24H Change</Text>
                  <Spacer horizontal value={scale(10)} />
                  <Row alignItems="center">
                    <TrendIcon color="#FFFFFF" />
                    <Spacer horizontal value={scale(7)} />
                    <Text color="#FFFFFF">
                      {' '}
                      {last24HourChange!.toFixed(2)}%
                    </Text>
                  </Row>
                </Row>
              </>
            )}
            {!!Object.hasOwn(props, 'txFee') && (
              <>
                <Spacer value={verticalScale(9)} />
                <Row alignItems="center">
                  <Text color="rgba(255, 255, 255, 0.5)">TxFee</Text>
                  <Text color="#FFFFFF">
                    {'   '}
                    {NumberUtils.formatNumber(txFee!, 5)}
                  </Text>
                </Row>
              </>
            )}
            <Spacer value={verticalScale(9)} />
            <Row alignItems="center" justifyContent="space-between">
              <Text subtext color="rgba(255, 255, 255, 0.5)">
                Time Stamp{' '}
              </Text>
              <Text subtext color="#FFFFFF">
                {dayjs(timestamp).format('YYYY-MM-DD')}
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
    </ImageBackground>
  );
}
