import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import {
  Notification,
  NotificationWithPriceChange
} from '@models/Notification';
import { View } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import moment from 'moment';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';

interface NotificationBoxProps {
  notification: Notification;
}

export const NotificationBox = (props: NotificationBoxProps): JSX.Element => {
  const { notification } = props;
  const { type, body, createdAt } = notification;
  const { t } = useTranslation();

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
          {body}
        </Text>
      </View>
      <Spacer horizontal value={scale(21)} />
      {renderChangeInfo()}
    </Row>
  );
};
