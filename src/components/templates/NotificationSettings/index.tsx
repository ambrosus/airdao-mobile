import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SegmentedPicker, Segment } from '@components/composite';
import { Row, Spacer, Switch, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { useNotificationSettings } from '@hooks/cache';
import { NotificationSettings } from '@appTypes/notification';
import { styles } from './styles';

const Title = ({ children }: { children: React.ReactNode }) => (
  <Text
    title
    fontFamily="Inter_600SemiBold"
    fontSize={16}
    color={COLORS.smokyBlack}
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

// TODO implement watchlists switch https://www.figma.com/file/IQTwaJxVxOXTb8x2cfaxfT/MOBILE-APP-V2.0?type=design&node-id=842-12274&mode=dev

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
    value: any
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
            <Title>{t('price.alerts.switch')}</Title>
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
          <Title>{t('price.alerts.treshold')}</Title>
          <Spacer value={verticalScale(8)} />
          <Text
            fontSize={12}
            fontFamily="Inter_500Medium"
            color={COLORS.davysGray}
          >
            {t('price.alerts.treshold.text')}
          </Text>
          <Spacer value={verticalScale(8)} />
          <SegmentedPicker
            segments={PercentThresholds}
            selectedSegment={
              PercentThresholds.find(
                (s) =>
                  s.value === localNotificationSettings.pricePercentThreshold
              )?.id || PercentThresholds[0].id
            }
            onSelectSegment={(selectedSegment) =>
              onSettingsValueChange(
                'pricePercentThreshold',
                selectedSegment.value
              )
            }
          />
          <Spacer value={verticalScale(32)} />
          {/* Transaction Alerts */}
          <Row justifyContent="space-between" alignItems="center">
            <View>
              <Title>{t('transaction.alerts.switch')}</Title>
              <Spacer value={verticalScale(8)} />
              <Text
                fontSize={12}
                fontFamily="Inter_500Medium"
                color={COLORS.davysGray}
              >
                {t('transaction.alerts.switch.text')}
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
