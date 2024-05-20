import React, { useCallback, useMemo, useRef } from 'react';
import { Alert, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { AddIcon, NotificationIcon, ScannerIcon } from '@components/svg/icons';
import { moderateScale, scale } from '@utils/scaling';
import { Button, Spacer } from '@components/base';
import {
  BarcodeScanner,
  BottomSheetWalletCreateOrImport
} from '@components/templates';
import { HomeNavigationProp } from '@appTypes/navigation';
import { etherumAddressRegex } from '@constants/regex';
import { useNotificationsQuery } from '@hooks';
import { Cache, CacheKey } from '@lib/cache';
import { COLORS } from '@constants/colors';
import { useNewNotificationsCount } from '@screens/Wallets/hooks/useNewNotificationsCount';
import usePasscode from '@contexts/Passcode';

export const HomeHeader = React.memo((): JSX.Element => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const scanner = useRef<BottomSheetRef>(null);
  const walletImportCreate = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const { data: notifications } = useNotificationsQuery();
  const newNotificationsCount = useNewNotificationsCount();
  const { t } = useTranslation();

  const { toggleIsRequestingPermission } = usePasscode();

  const openScanner = useCallback(() => {
    toggleIsRequestingPermission(true);
    scanner.current?.show();
  }, [toggleIsRequestingPermission, scanner]);

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
        Alert.alert(t('alert.invalid.qr.code.msg'), '', [
          {
            text: t('alert.scan.again.msg'),
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

  const renderContentRight = useMemo(() => {
    return (
      <>
        <View style={{ bottom: scale(3) }}>
          <Button onPress={openScanner}>
            <ScannerIcon color="#393b40" />
          </Button>
          <BottomSheet height={WINDOW_HEIGHT} ref={scanner} borderRadius={0}>
            <BarcodeScanner
              onScanned={onQRCodeScanned}
              onClose={closeScanner}
            />
          </BottomSheet>
        </View>
        <Spacer horizontal value={scale(25)} />
        <Button onPress={navigateToNotifications}>
          <NotificationIcon color="#393b40" />
          {newNotificationsCount > 0 && (
            <View style={[styles.notificationCountContainer]}></View>
          )}
        </Button>
      </>
    );
  }, [
    WINDOW_HEIGHT,
    navigateToNotifications,
    newNotificationsCount,
    onQRCodeScanned,
    openScanner
  ]);

  const openWalletImportCreateModal = useCallback(() => {
    walletImportCreate.current?.show();
  }, []);

  const renderContentLeft = useMemo(() => {
    return (
      <>
        <Button
          onPress={() => openWalletImportCreateModal()}
          type="circular"
          style={styles.addOrImportWalletButton}
        >
          <AddIcon color={COLORS.neutral800} scale={1.25} />
        </Button>
        <BottomSheetWalletCreateOrImport ref={walletImportCreate} />
      </>
    );
  }, [openWalletImportCreateModal]);

  const headerStyles = useMemo(() => {
    return { ...styles.container };
  }, []);

  return (
    <Header
      bottomBorder
      backIconVisible={false}
      style={headerStyles}
      contentRight={renderContentRight}
      contentLeft={renderContentLeft}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.culturedWhite
  },
  notificationCountContainer: {
    position: 'absolute',
    backgroundColor: COLORS.yellow500,
    right: 0,
    top: 0,
    borderRadius: scale(9),
    borderWidth: 2,
    borderColor: COLORS.neutral0,
    width: moderateScale(11),
    height: moderateScale(11),
    justifyContent: 'center',
    alignItems: 'center'
  },
  addOrImportWalletButton: {
    backgroundColor: COLORS.alphaBlack5,
    width: scale(38),
    height: scale(38)
  }
});
