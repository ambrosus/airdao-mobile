import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  useWindowDimensions,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Switch } from 'react-native-gesture-handler';
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
import { Button, Input, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BackIcon, CloseIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { useAMBPrice } from '@hooks/query';
import { useNotificationSettings } from '@hooks/cache';
import { NotificationSettings } from '@appTypes/notification';
import { DefaultNotificationSettings } from '@constants/variables';
import { styles } from './styles';
import { FloatButton } from '@components/base/FloatButton';

const Title = ({ children }: { children: React.ReactNode }) => (
  <Text title fontFamily="Inter_600SemiBold">
    {children}
  </Text>
);

const PercentThresholds: Segment[] = [
  {
    title: '5%',
    value: 5,
    id: '5'
  },
  {
    title: '8%',
    value: 8,
    id: '8'
  },
  {
    title: '10%',
    value: 10,
    id: '10'
  }
];

export const BottomSheetNotificationSettings = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { data } = useAMBPrice();
  const { data: notificationSettings, save } = useNotificationSettings();
  const [localNotificationSettings, setLocalNotificationSettings] =
    useState<NotificationSettings>(notificationSettings);

  const { height: WINDOW_HEIGHT } = useWindowDimensions();
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
  };

  const saveSettings = async () => {
    await save(localNotificationSettings);
    localRef.current?.dismiss();
  };

  return (
    <BottomSheet
      height={
        Platform.OS === 'ios'
          ? WINDOW_HEIGHT - topInset
          : Dimensions.get('screen').height
      }
      ref={localRef}
      {...props}
    >
      {Platform.OS === 'android' && <Spacer value={scale(57)} />}
      <Header
        titleStyle={styles.headerTitle}
        title="Notification settings"
        titlePosition="center"
        backIconVisible={false}
        style={styles.header}
        contentLeft={
          <Button onPress={localRef.current?.dismiss}>
            {Platform.OS === 'ios' ? <CloseIcon /> : <BackIcon />}
          </Button>
        }
        contentRight={
          Platform.OS === 'ios' && (
            <Button onPress={saveSettings}>
              <Text
                title
                fontFamily="Inter_500Medium"
                color={COLORS.jungleGreen}
              >
                Save
              </Text>
            </Button>
          )
        }
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          <Text color="#646464" fontWeight="400" fontSize={15}>
            Set notifications for AMB token
          </Text>

          {/* Price alerts */}
          <Spacer value={verticalScale(12)} />
          <Button
            onPress={() =>
              onSettingsValueChange(
                'priceAlerts',
                !localNotificationSettings.priceAlerts
              )
            }
          >
            <Row alignItems="center" justifyContent="space-between">
              <Title>Price alerts</Title>
              <Switch disabled value={localNotificationSettings.priceAlerts} />
            </Row>
          </Button>

          {/* Price Threshold */}
          <Spacer value={verticalScale(32)} />
          <Row alignItems="center">
            <Title>Set price threshold</Title>
            <Spacer value={scale(12)} horizontal />
            <Text fontWeight="500" fontSize={12} color="#646464">
              AMB PRICE: ~${data?.priceUSD}
            </Text>
          </Row>
          <Spacer value={verticalScale(12)} />
          <Row alignItems="center" justifyContent="space-between">
            <Input
              type="number"
              placeholder="Min"
              style={styles.input}
              value={
                localNotificationSettings.priceThreshold.min
                  ? localNotificationSettings.priceThreshold.min.toString()
                  : undefined
              }
              onChangeValue={(newValue: string) =>
                onSettingsValueChange('priceThreshold', {
                  min:
                    parseInt(newValue) ||
                    DefaultNotificationSettings.priceThreshold.min,
                  max: localNotificationSettings.priceThreshold.max
                })
              }
            />
            <Spacer horizontal value={scale(19)} />
            <Input
              type="number"
              placeholder="Max"
              style={styles.input}
              value={
                localNotificationSettings.priceThreshold.max
                  ? localNotificationSettings.priceThreshold.max.toString()
                  : undefined
              }
              onChangeValue={(newValue: string) =>
                onSettingsValueChange('priceThreshold', {
                  min: localNotificationSettings.priceThreshold.min,
                  max:
                    parseInt(newValue) ||
                    DefaultNotificationSettings.priceThreshold.max
                })
              }
            />
          </Row>

          {/* Percentage Change */}
          <Spacer value={verticalScale(32)} />
          <Title>AMB movement threshold</Title>
          <Spacer value={verticalScale(12)} />
          <Text fontSize={12} fontWeight="500" color="#646464">
            You’ll be notified of significant increase & decrease of AMB token
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
          <Spacer value={verticalScale(32)} />
          <View style={styles.separator} />
          <Spacer value={verticalScale(32)} />

          {/* Transaction alerts */}
          <Text fontSize={15} fontWeight="400" color="#646464">
            Set notifications for Watchlists
          </Text>
          {/* Transaction Alerts */}
          <Spacer value={verticalScale(12)} />
          <Button
            onPress={() =>
              onSettingsValueChange(
                'transactionAlerts',
                !localNotificationSettings.transactionAlerts
              )
            }
          >
            <Row alignItems="center" justifyContent="space-between">
              <Title>Transaction alerts</Title>
              <Switch
                disabled
                value={localNotificationSettings.transactionAlerts}
              />
            </Row>
          </Button>
          {/* Transaction threshold */}
          <Spacer value={verticalScale(32)} />
          <Title>Set transaction threshold</Title>
          <Spacer value={verticalScale(12)} />
          <Row alignItems="center" justifyContent="space-between">
            <Input
              type="number"
              placeholder="Min"
              style={styles.input}
              value={
                localNotificationSettings.transactionThreshold.min ===
                DefaultNotificationSettings.transactionThreshold.min
                  ? undefined
                  : localNotificationSettings.transactionThreshold.min.toString()
              }
              onChangeValue={(newValue: string) =>
                onSettingsValueChange('transactionThreshold', {
                  min:
                    parseInt(newValue) ||
                    DefaultNotificationSettings.transactionThreshold.min,
                  max: localNotificationSettings.transactionThreshold.max
                })
              }
            />
            <Spacer horizontal value={scale(19)} />
            <Input
              type="number"
              placeholder="Max"
              style={styles.input}
              value={
                localNotificationSettings.transactionThreshold.max
                  ? localNotificationSettings.transactionThreshold.max.toString()
                  : undefined
              }
              onChangeValue={(newValue: string) =>
                onSettingsValueChange('transactionThreshold', {
                  min: localNotificationSettings.transactionThreshold.min,
                  max:
                    parseInt(newValue) ||
                    DefaultNotificationSettings.transactionThreshold.max
                })
              }
            />
          </Row>
          {/* Balance Percentage Change */}
          <Spacer value={verticalScale(32)} />
          <Title>AMB movement threshold</Title>
          <Spacer value={verticalScale(12)} />
          <Text fontSize={12} fontWeight="500" color="#646464">
            You’ll be notified of significant increase & decrease of AMB token
          </Text>
          <Spacer value={verticalScale(12)} />
          <SegmentedPicker
            segments={PercentThresholds}
            selectedSegment={
              PercentThresholds.find(
                (s) =>
                  s.value === localNotificationSettings.balancePercentChange
              )?.id || PercentThresholds[0].id
            }
            onSelectSegment={(selectedSegment) =>
              onSettingsValueChange(
                'balancePercentChange',
                selectedSegment.value
              )
            }
          />
          <Spacer value={verticalScale(32)} />
        </View>
      </ScrollView>
      {Platform.OS === 'android' ? (
        <FloatButton
          title="Save"
          onPress={() => {
            localRef.current?.dismiss();
          }}
          bottomPadding={17}
        />
      ) : (
        <></>
      )}
    </BottomSheet>
  );
});
