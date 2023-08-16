import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import {
  BottomSheet,
  Header,
  SegmentedPicker,
  Segment
} from '@components/composite';
import {
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Row, Spacer, Switch, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { useNotificationSettings } from '@hooks/cache';
import { NotificationSettings } from '@appTypes/notification';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

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

export const BottomSheetNotificationSettings = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { data: notificationSettings, save } = useNotificationSettings();
  const [localNotificationSettings, setLocalNotificationSettings] =
    useState<NotificationSettings>(notificationSettings);
  const { top: topInset } = useSafeAreaInsets();
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
    <BottomSheet
      containerStyle={styles.bottomSheet}
      height={'100%'}
      ref={localRef}
      {...props}
    >
      {Platform.OS === 'ios' && <Spacer value={topInset} />}
      <Header
        title={
          <Text
            fontFamily="Inter_700Bold"
            fontSize={16}
            color={COLORS.smokyBlack}
          >
            {t('notification.settings')}
          </Text>
        }
        titlePosition={Platform.select({ ios: 'left', default: 'center' })}
        backIconVisible={true}
        onBackPress={() => localRef.current?.dismiss()}
        style={styles.header}
      />
      <ScrollView
        testID="BottomSheetNotiSettings_Container"
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
              testID="BottomSheetNotiSettings_Price_Switch"
              value={localNotificationSettings.priceAlerts}
            />
          </Row>
          {/* Percentage Change */}
          <Spacer value={verticalScale(35)} />
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
    </BottomSheet>
  );
});
