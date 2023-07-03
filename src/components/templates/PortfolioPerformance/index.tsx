/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { ImageBackground, View } from 'react-native';
import moment from 'moment';
import { Row, Spacer, Text } from '@components/base';
import { LogoSVG, TrendIcon } from '@components/svg/icons';
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
      imageStyle={styles.container}
    >
      <Row alignItems="center" style={styles.innerContainer}>
        <View style={styles.details}>
          {/* title */}
          <Text
            fontSize={13}
            fontFamily="Inter_600SemiBold"
            color={COLORS.white}
          >
            {title}
          </Text>
          <Spacer value={verticalScale(6)} />
          {/* balance */}
          <Text
            fontSize={22}
            fontFamily="Mersad_600SemiBold"
            color={COLORS.white}
          >
            {currencyPosition === 'left' ? currency : ''}
            {balance}
            {currencyPosition === 'right' ? ' ' + currency : ''}
          </Text>
          {/* fee */}
          {Object.hasOwn(props, 'txFee') && (
            <>
              <Spacer value={verticalScale(6)} />
              <Row alignItems="center">
                <Text
                  fontSize={11}
                  color={COLORS.white50}
                  fontFamily="Inter_600SemiBold"
                >
                  TxFee
                </Text>
                <Spacer horizontal value={scale(8)} />
                <Text
                  color={COLORS.white}
                  fontSize={11}
                  fontFamily="Inter_600SemiBold"
                >
                  {NumberUtils.formatNumber(txFee!, 5)}
                </Text>
              </Row>
            </>
          )}
          {/* 24hr change */}
          {Object.hasOwn(props, 'last24HourChange') && (
            <>
              <Spacer value={verticalScale(6)} />
              <Row alignItems="center">
                <Text
                  fontSize={11}
                  color={COLORS.white50}
                  fontFamily="Inter_600SemiBold"
                >
                  24H Change
                </Text>
                <Spacer horizontal value={scale(10)} />
                <Row alignItems="center">
                  <TrendIcon
                    color={COLORS.white}
                    type={(last24HourChange || 0) >= 0 ? 'up' : 'down'}
                  />
                  <Spacer horizontal value={scale(5)} />
                  <Text fontSize={12} color={COLORS.white}>
                    {last24HourChange!.toFixed(2)}%
                  </Text>
                </Row>
              </Row>
            </>
          )}
          {/* timestamp */}
          <Spacer value={verticalScale(8)} />
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={11}
              fontFamily="Inter_600SemiBold"
              color={COLORS.white}
            >
              {moment(timestamp).format('YYYY-MM-DD')}
            </Text>
            <Text
              fontSize={11}
              fontFamily="Inter_600SemiBold"
              color={COLORS.white}
            >
              {moment(timestamp).format('hh:mm A').toLowerCase()}
            </Text>
          </Row>
        </View>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <LogoSVG color={COLORS.white} scale={2} />
          </View>
        </View>
      </Row>
    </ImageBackground>
  );
}
