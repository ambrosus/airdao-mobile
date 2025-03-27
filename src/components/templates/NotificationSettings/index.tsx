import { ReactNode, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NotificationSettings } from '@appTypes/notification';
import { Button, Row, Spacer, Switch, Text } from '@components/base';
import { Segment } from '@components/composite';
import { COLORS } from '@constants/colors';
import { useNotificationSettings } from '@hooks/cache';
import { scale, verticalScale } from '@utils';
import { styles } from './styles';

const Title = ({ children }: { children: ReactNode }) => (
  <Text
    title
    fontFamily="Inter_600SemiBold"
    fontSize={scale(17)}
    color={COLORS.neutral900}
  >
    {children}
  </Text>
);

const PercentThresholds: Segment[] = [
  {
    title: '5%',
    value: 5,
    id: '1'
  },
  {
    title: '8%',
    value: 8,
    id: '2'
  },
  {
    title: '10%',
    value: 10,
    id: '3'
  }
];

export const NotificationSettingsView = () => {
  const { data: notificationSettings, save } = useNotificationSettings();
  const [localNotificationSettings, setLocalNotificationSettings] =
    useState<NotificationSettings>(notificationSettings);
  const { t } = useTranslation();

  useEffect(
    () => setLocalNotificationSettings(notificationSettings),
    [notificationSettings]
  );

  const onSettingsValueChange = (
    key: keyof NotificationSettings,
    value: number | boolean
  ) => {
    setLocalNotificationSettings({
      ...localNotificationSettings,
      [key]: value
    });
    save({
      ...localNotificationSettings,
      [key]: value
    });
  };

  return (
    <View>
      <ScrollView
        testID="NotiSettings_Container"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          {/* Price alerts */}
          <Row alignItems="center" justifyContent="space-between">
            <Title>{t('notification.settings.price.alerts.switch')}</Title>
            <Switch
              onValueChange={() =>
                onSettingsValueChange(
                  'priceAlerts',
                  !localNotificationSettings.priceAlerts
                )
              }
              testID="NotiSettings_Price_Switch"
              value={localNotificationSettings.priceAlerts}
            />
          </Row>
          {/* Percentage Change */}
          <Spacer value={verticalScale(32)} />
          <Title>{t('notification.settings.price.alerts.treshold')}</Title>
          <Spacer value={verticalScale(8)} />
          <Text
            fontSize={12}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral500}
          >
            {t('notification.settings.price.alerts.treshold.text')}
          </Text>
          <Spacer value={verticalScale(12)} />
          <Row
            justifyContent="space-between"
            style={styles.priceAlertContainer}
          >
            {PercentThresholds.map((item) => {
              const isActive =
                item.value === localNotificationSettings.pricePercentThreshold;
              return (
                <Button
                  style={{
                    backgroundColor:
                      COLORS[isActive ? 'brand100' : 'neutral100'],
                    borderWidth: isActive ? 2 : 1,
                    borderColor: COLORS[isActive ? 'brand400' : 'neutral400'],
                    ...styles.priceAlertBtnContainer
                  }}
                  key={item.id}
                  onPress={() =>
                    onSettingsValueChange(
                      'pricePercentThreshold',
                      item.value as number
                    )
                  }
                >
                  <Text
                    style={{
                      ...styles.btnText,
                      color: COLORS[isActive ? 'brand500' : 'neutral900']
                    }}
                  >
                    {item.title}
                  </Text>
                </Button>
              );
            })}
          </Row>
          <Spacer value={verticalScale(22)} />
          {/* Transaction Alerts */}
          <Row justifyContent="space-between" alignItems="center">
            <View>
              <Title>{t('settings.watchlists')}</Title>
              <Spacer value={verticalScale(8)} />
              <Text
                fontSize={12}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral500}
              >
                {t('notification.settings.transaction.alerts.switch.text')}
              </Text>
            </View>
            <Switch
              onValueChange={() =>
                onSettingsValueChange(
                  'transactionAlerts',
                  !localNotificationSettings.transactionAlerts
                )
              }
              value={localNotificationSettings.transactionAlerts}
            />
          </Row>
        </View>
      </ScrollView>
    </View>
  );
};
