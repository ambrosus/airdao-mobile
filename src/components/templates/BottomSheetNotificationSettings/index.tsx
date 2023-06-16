import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
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
import { Button, Row, Spacer, Switch, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BackIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import { useNotificationSettings } from '@hooks/cache';
import { NotificationSettings } from '@appTypes/notification';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    title: '0.5%',
    value: 0.5,
    id: '1'
  },
  {
    title: '1%',
    value: 1,
    id: '2'
  },
  {
    title: '1.5%',
    value: 1.5,
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
      height={Dimensions.get('screen').height}
      ref={localRef}
      {...props}
    >
      <Spacer value={topInset} />
      <Header
        title={
          <Text
            fontFamily="Inter_700Bold"
            fontSize={16}
            color={COLORS.smokyBlack}
          >
            Notification settings
          </Text>
        }
        titlePosition="center"
        backIconVisible={false}
        style={styles.header}
        contentLeft={
          <Button
            testID="BottomSheet_Notification_Settings_Header_Left"
            onPress={localRef.current?.dismiss}
          >
            <BackIcon testID="Notification_Settings_Header_Back_Icon" />
          </Button>
        }
      />
      <ScrollView
        testID="BottomSheetNotiSettings_Container"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          {/* Price alerts */}
          <Button
            onPress={() =>
              onSettingsValueChange(
                'priceAlerts',
                !localNotificationSettings.priceAlerts
              )
            }
          >
            <Row alignItems="center" justifyContent="space-between">
              <Title>Price alert</Title>
              <Switch
                testID="BottomSheetNotiSettings_Price_Switch"
                disabled
                value={localNotificationSettings.priceAlerts}
              />
            </Row>
          </Button>
          {/* Percentage Change */}
          <Spacer value={verticalScale(24)} />
          <Title>Price movement threshold</Title>
          <Spacer value={verticalScale(12)} />
          <Text fontSize={12} fontWeight="500" color="#646464">
            You’ll be notified of significant increase & decrease of AMB price{' '}
          </Text>
          <Spacer value={verticalScale(12)} />
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
          <Spacer value={verticalScale(24)} />
          {/* Transaction Alerts */}
          <Button
            onPress={() =>
              onSettingsValueChange(
                'transactionAlerts',
                !localNotificationSettings.transactionAlerts
              )
            }
          >
            <Row alignItems="center" justifyContent="space-between">
              <Title>Transaction alert</Title>
              <Switch
                disabled
                value={localNotificationSettings.transactionAlerts}
              />
            </Row>
          </Button>
          <Text fontSize={12} fontWeight="500" color="#646464">
            You’ll be notified of any transaction {'\n'} in your watchlist
          </Text>
        </View>
      </ScrollView>
    </BottomSheet>
  );
});
