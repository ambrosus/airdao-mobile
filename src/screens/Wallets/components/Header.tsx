import React, { useCallback, useMemo, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  useWindowDimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { NotificationIcon, ScannerIcon } from '@components/svg/icons';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { Button, Spacer, Text } from '@components/base';
import { WalletsNavigationProp } from '@appTypes/navigation';
import { BarcodeScanner } from '@components/templates';
import { etherumAddressRegex } from '@constants/regex';
import { OnboardingView } from '@components/templates/OnboardingView';
import { useNotificationsQuery } from '@hooks';
import { Cache, CacheKey } from '@utils/cache';
import { useNewNotificationsCount } from '../hooks/useNewNotificationsCount';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';

export const HomeHeader = React.memo((): JSX.Element => {
  const navigation = useNavigation<WalletsNavigationProp>();
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const scanner = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const { data: notifications } = useNotificationsQuery();
  const newNotificationsCount = useNewNotificationsCount();
  const { t } = useTranslation();

  const openScanner = () => {
    scanner.current?.show();
  };

  const closeScanner = () => {
    scanner.current?.dismiss();
  };

  const onQRCodeScanned = useCallback(
    (data: string) => {
      const res = data.match(etherumAddressRegex);
      if (res && res?.length > 0) {
        closeScanner();
        navigation.navigate('Search', {
          screen: 'SearchScreen',
          params: { address: res[0] }
        });
      } else if (!scanned.current) {
        scanned.current = true;
        Alert.alert(t('invalid.qr.code.msg'), '', [
          {
            text: t('scan.again.msg'),
            onPress: () => {
              scanned.current = false;
            }
          }
        ]);
      }
    },
    [navigation, t]
  );

  const setLastNotificationTime = useCallback(() => {
    if (notifications[0]?.createdAt) {
      Cache.setItem(
        CacheKey.LastNotificationTimestamp,
        notifications[0].createdAt.getTime()
      );
    }
  }, [notifications]);

  const navigateToNotifications = useCallback(() => {
    navigation.navigate('Notifications');
    setLastNotificationTime();
  }, [navigation, setLastNotificationTime]);

  const notificationCount =
    newNotificationsCount > 99 ? '99+' : newNotificationsCount;

  const newNotificationsCountStyles =
    notificationCount.toString().length > 2
      ? moderateScale(25)
      : moderateScale(18);

  const renderContentRight = useMemo(() => {
    return (
      <>
        <Spacer horizontal value={scale(20)} />
        <Button onPress={navigateToNotifications}>
          <NotificationIcon color="#393b40" />
          {newNotificationsCount > 0 && (
            <View
              style={[
                styles.notificationCountContainer,
                { width: newNotificationsCountStyles, left: 7 }
              ]}
            >
              <Text color="white" fontSize={11} fontFamily="Inter_600SemiBold">
                {notificationCount}
              </Text>
            </View>
          )}
        </Button>
      </>
    );
  }, [
    navigateToNotifications,
    newNotificationsCount,
    newNotificationsCountStyles,
    notificationCount
  ]);

  const renderContentLeft = useMemo(() => {
    return (
      <>
        <OnboardingView
          thisStep={12}
          childrenAlwaysVisible
          tooltipPlacement="bottom"
          helpers={{ next: openScanner }}
          removeAndroidStatusBarHeight
        >
          <Button
            onPress={() => {
              openScanner();
            }}
          >
            <ScannerIcon color="#393b40" />
          </Button>
        </OnboardingView>
        <BottomSheet height={WINDOW_HEIGHT} ref={scanner} borderRadius={0}>
          <BarcodeScanner onScanned={onQRCodeScanned} onClose={closeScanner} />
        </BottomSheet>
      </>
    );
  }, [WINDOW_HEIGHT, onQRCodeScanned]);

  const headerStyles = useMemo(() => {
    return { ...styles.container };
  }, []);

  return (
    <Header
      backIconVisible={false}
      style={headerStyles}
      contentRight={renderContentRight}
      contentLeft={renderContentLeft}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor:
      Platform.OS === 'ios' ? COLORS.white : COLORS.culturedWhite,
    shadowColor: COLORS.culturedWhite
  },
  notificationCountContainer: {
    position: 'absolute',
    backgroundColor: '#ff7a00',
    right: 0,
    top: -verticalScale(4),
    borderRadius: scale(9),
    width: moderateScale(18),
    height: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
