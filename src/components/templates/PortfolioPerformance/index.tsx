/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { Badge } from '@components/base/Badge';

export interface PortfolioPerformanceProps {
  balance: string;
  currency: string;
  currencyPosition: 'left' | 'right';
  last24HourChange?: number;
  txFee?: number;
  title: string | JSX.Element;
  timestamp: Date;
  isAMBStatisticsFlow?: boolean;
}

export function PortfolioPerformance(
  props: PortfolioPerformanceProps
): JSX.Element {
  const { t } = useTranslation();
  const {
    balance,
    currency,
    currencyPosition,
    txFee,
    title,
    timestamp,
    isAMBStatisticsFlow
  } = props;

  return (
    <View
      style={styles.container}
      // source={require('../../../../assets/images/portfolio-perfomance.png')}
      // resizeMode="cover"
      // imageStyle={styles.container}
      // testID="Portfolio_Performance"
    >
      <Row alignItems="center" justifyContent="space-between">
        <View>
          {/* title */}
          <Text
            fontSize={12}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral0}
          >
            {title}
          </Text>
          {!isAMBStatisticsFlow && <Spacer value={verticalScale(6)} />}
          {/* balance */}
          <Text
            fontSize={26}
            fontFamily="Mersad_600SemiBold"
            color={COLORS.neutral0}
          >
            {currencyPosition === 'left' ? currency : ''}
            {balance}
            {currencyPosition === 'right' ? ' ' + currency : ''}
          </Text>
          {/* fee */}
          {Object.hasOwn(props, 'txFee') && (
            <>
              <Spacer value={verticalScale(12)} />
              <Row alignItems="center">
                <Text
                  fontSize={11}
                  color={COLORS.alphaWhite50}
                  fontFamily="Inter_600SemiBold"
                >
                  {t('share.tx.fee')}
                </Text>
                <Spacer horizontal value={scale(8)} />
                <Text
                  color={COLORS.neutral0}
                  fontSize={11}
                  fontFamily="Inter_600SemiBold"
                >
                  {NumberUtils.formatNumber(txFee!, 5)}
                </Text>
              </Row>
            </>
          )}
          {/* 24hr change */}
          {Object.hasOwn(props, 'last24HourChange') &&
            props.last24HourChange !== undefined && (
              <>
                <Spacer value={verticalScale(8)} />
                <Row alignItems="center">
                  <Badge
                    color={COLORS.neutral100}
                    icon={
                      <Row style={{ paddingHorizontal: 4 }}>
                        <Text
                          fontSize={12}
                          color={
                            props.last24HourChange >= 0
                              ? COLORS.success400
                              : COLORS.error400
                          }
                        >
                          {`${
                            props.last24HourChange >= 0 ? '+' : '-'
                          }${Math.abs(props.last24HourChange).toFixed(2)}%`}
                        </Text>
                        <Spacer horizontal value={scale(4)} />
                        <Text
                          fontSize={12}
                          color={COLORS.neutral800}
                          fontFamily="Inter_600SemiBold"
                        >
                          {'('}
                          {t('share.24hr')}
                          {')'}
                        </Text>
                      </Row>
                    }
                  ></Badge>
                </Row>
              </>
            )}
          {/* timestamp */}
          <Spacer value={verticalScale(6)} />
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={12}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral100}
            >
              {moment(timestamp).format('YYYY-MM-DD')}
            </Text>
            <Spacer horizontal value={scale(6)} />
            <Text
              fontSize={12}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral100}
            >
              {moment(timestamp).format('hh:mm A').toLowerCase()}
            </Text>
          </Row>
        </View>
        <Spacer value={scale(4)} horizontal />
        <Image
          source={require('@assets/images/logo-sun-like.png')}
          style={{
            height: verticalScale(100),
            width: scale(100)
          }}
        />
      </Row>
    </View>
  );
}
