import { useCallback } from 'react';
import { Text as RNText, View } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  Notification,
  NotificationWithPriceChange
} from '@models/Notification';
import { scale, verticalScale, NumberUtils } from '@utils';
import { styles } from './styles';

interface NotificationBoxProps {
  notification: Notification;
}

export const NotificationBox = ({
  notification
}: NotificationBoxProps): JSX.Element => {
  const { t } = useTranslation();

  const processPriceChangeBody = useCallback(() => {
    const { body } = notification;
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
          testID="notification_percentage_text"
          style={{
            color: isPositiveChange ? COLORS.success400 : COLORS.error400
          }}
        >
          {percentChange}
        </Text>
        {parts[1]}
      </>
    );
  }, [notification]);

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
      <View style={styles.changeInfoContainer}>
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
    <Row
      style={styles.container}
      justifyContent="space-between"
      alignItems="center"
    >
      <View style={styles.innerContainer}>
        <Row alignItems="center" justifyContent="space-between">
          {!!notification.type && (
            <>
              <Text
                fontSize={15}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral800}
              >
                {t(`common.notification.${notification.type}`)}
              </Text>
              <Spacer value={scale(4)} horizontal />
            </>
          )}
          <RNText style={styles.baseTextSecondary}>
            {moment(notification.createdAt).format('HH:mm')}
          </RNText>
        </Row>
        <Spacer value={verticalScale(4)} />
        <RNText style={styles.baseText}>{processPriceChangeBody()}</RNText>
      </View>
      {renderChangeInfo()}
    </Row>
  );
};
