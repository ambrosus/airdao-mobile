import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import {
  Notification,
  NotificationWithPriceChange
} from '@models/Notification';
import { View } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
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
      <View style={{ flex: 1 }}>
        <Row alignItems="center">
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.smokyBlack}
          >
            {type}
          </Text>
          <Spacer value={scale(4)} horizontal />
          <View
            style={{
              width: moderateScale(4),
              height: moderateScale(4),
              borderRadius: moderateScale(2),
              backgroundColor: COLORS.slateGrey
            }}
          />
          <Spacer value={scale(4)} horizontal />
          <Text fontSize={13} color={COLORS.grey}>
            {dayjs(createdAt).fromNow()}
          </Text>
        </Row>
        <Spacer value={verticalScale(5)} />
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.davysGray}
        >
          {body}
        </Text>
        <Spacer value={verticalScale(5)} />
      </View>
      <Spacer horizontal value={scale(21)} />
      {renderChangeInfo()}
    </Row>
  );
};
