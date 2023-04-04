import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import { DownArrowIcon, TradeIcon, TrendIcon } from '@components/svg/icons';
import {
  Notification,
  NotificationType,
  NotificationWithPriceChange
} from '@models/Notification';
import { View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { COLORS } from '@constants/colors';

dayjs.extend(relativeTime);

interface NotificationBoxProps {
  notification: Notification;
}

export const NotificationBox = (props: NotificationBoxProps): JSX.Element => {
  const { notification } = props;
  const { type, body, createdAt } = notification;
  const renderIcon = () => {
    switch (type) {
      case NotificationType.WalletUpdate: {
        return <TrendIcon color="#000000" />;
      }
      case NotificationType.PriceAlert: {
        return <TradeIcon color="#000000" />;
      }
      case NotificationType.TransactionAlert: {
        return <DownArrowIcon color="#000000" />;
      }
    }
  };

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
        <Spacer value={verticalScale(5)} />
        <Text fontSize={13} color={COLORS.darkGrey} opacity={0.5}>
          ${NumberUtils.formatNumber(notificationWithPriceChange.amount, 0)}
        </Text>
      </View>
    );
  };

  return (
    <Row justifyContent="space-between" alignItems="center">
      {renderIcon()}
      <Spacer horizontal value={scale(21)} />
      <View style={{ flex: 1 }}>
        <Text
          fontSize={13}
          fontFamily="Inter_600SemiBold"
          color={COLORS.darkGrey}
        >
          {type}
        </Text>
        <Spacer value={verticalScale(5)} />
        <Text
          fontSize={13}
          fontFamily="Inter_600SemiBold"
          color={COLORS.darkGrey}
          opacity={0.8}
        >
          {body}
        </Text>
        <Spacer value={verticalScale(5)} />
        <Text fontSize={13} color={COLORS.grey}>
          {dayjs(createdAt).fromNow()}
        </Text>
      </View>
      <Spacer horizontal value={scale(21)} />
      {renderChangeInfo()}
    </Row>
  );
};
