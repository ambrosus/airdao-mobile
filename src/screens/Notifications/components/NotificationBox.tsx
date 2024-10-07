import React, { useCallback } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import {
  Notification,
  NotificationWithPriceChange
} from '@models/Notification';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';

interface NotificationBoxProps {
  notification: Notification;
}

export const NotificationBox = (props: NotificationBoxProps): JSX.Element => {
  const { notification } = props;
  const { type, body, createdAt } = notification;
  const { t } = useTranslation();

  const processPriceChangeBody = useCallback(() => {
    // Extract the percentage change using a regular expression
    const percentChangeRegex = /([+-]?\d+(\.\d+)?)%|[$]([+-]?\d+(\.\d+)?)/g;
    const percentChangeMatch = body.match(percentChangeRegex);

    if (!percentChangeMatch) return body; // Return the original string if no match

    const percentChange = percentChangeMatch[0];
    const isPositiveChange = percentChange.includes('+'); // Determine if it's a positive change

    // Split the string into parts to separate the percent change
    const parts = body.split(percentChange);

    return (
      <>
        {parts[0]}
        <Text
          style={{
            color: isPositiveChange ? COLORS.success400 : COLORS.error400
          }}
        >
          {percentChange}
        </Text>
        {parts[1]}
      </>
    );
  }, [body]);

  const renderChangeInfo = () => {
    const notificationWithPriceChange =
      notification as NotificationWithPriceChange;
    if (
      !notificationWithPriceChange.percentChange ||
      !notificationWithPriceChange.amount
    ) {
      return null;
    }
    return (
      <View style={{ alignItems: 'center' }}>
        <Text fontSize={13}>
          {NumberUtils.addSignToNumber(
            notificationWithPriceChange.percentChange
          )}
          %
        </Text>
        <Spacer value={verticalScale(4)} />
        <Text fontSize={13} color={COLORS.darkGrey} opacity={0.5}>
          ${NumberUtils.formatNumber(notificationWithPriceChange.amount, 0)}
        </Text>
      </View>
    );
  };

  return (
    <Row justifyContent="space-between" alignItems="center">
      <View style={{ flex: 1 }}>
        <Row alignItems="center">
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral900}
          >
            {t(`common.notification.${type}`)}
          </Text>
          <Spacer value={scale(4)} horizontal />
          <View
            style={{
              width: moderateScale(4),
              height: moderateScale(4),
              borderRadius: moderateScale(2),
              backgroundColor: COLORS.neutral400
            }}
          />
          <Spacer value={scale(4)} horizontal />
          <Text
            fontSize={14}
            color={COLORS.neutral400}
            fontFamily="Inter_600SemiBold"
          >
            {moment(createdAt).fromNow()}
          </Text>
        </Row>
        <Spacer value={verticalScale(4)} />
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          {processPriceChangeBody()}
        </Text>
      </View>
      <Spacer horizontal value={scale(21)} />
      {renderChangeInfo()}
    </Row>
  );
};
