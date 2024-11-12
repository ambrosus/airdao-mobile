import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  InteractionManager,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  withSpring
} from 'react-native-reanimated';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { BarcodeScanner } from '@components/templates';
import {
  BarcodeScannerIcon,
  NotificationBellIcon
} from '@components/svg/icons/v2';
import { ethereumAddressRegex } from '@constants/regex';
import { useNotificationsQuery, useWallet } from '@hooks';
import { COLORS } from '@constants/colors';
import { useNewNotificationsCount } from '@screens/Wallets/hooks/useNewNotificationsCount';
import { WalletSessionsLabel } from '@features/wallet-connect/components/composite';
import {
  useHandleBottomSheetActions,
  useWalletConnectContextSelector
} from '@features/wallet-connect/lib/hooks';
import { CONNECT_VIEW_STEPS } from '@features/wallet-connect/types';
import { walletKit } from '@features/wallet-connect/utils';
import { Cache, CacheKey } from '@lib/cache';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { moderateScale, scale } from '@utils/scaling';
import { HomeNavigationProp } from '@appTypes/navigation';

import { StringUtils } from '@utils/string';
import { ExplorerAccount } from '@models';
import { NumberUtils } from '@utils/number';

interface HomeHeaderProps {
  account: ExplorerAccount | null;
  isHeaderHidden: SharedValue<boolean>;
}

export const HomeHeader = React.memo(
  ({ account, isHeaderHidden }: HomeHeaderProps): JSX.Element => {
    const { wallet } = useWallet();
    const { t } = useTranslation();
    const navigation = useNavigation<HomeNavigationProp>();
    const { height: WINDOW_HEIGHT } = useWindowDimensions();

    const { data: notifications } = useNotificationsQuery();
    const newNotificationsCount = useNewNotificationsCount();

    const { onShowWalletConnectBottomSheet } = useHandleBottomSheetActions();
    const { setWalletConnectStep, activeSessions } =
      useWalletConnectContextSelector();

    const scannerBottomSheetRef = useRef<BottomSheetRef>(null);
    const scanned = useRef(false);

    const [headerHidden, setHeaderHidden] = useState(false);

    useDerivedValue(() => {
      const shouldHide = isHeaderHidden.value;
      runOnJS(setHeaderHidden)(shouldHide);
    }, [isHeaderHidden]);

    const animatedContentStyle = useAnimatedStyle(() => ({
      opacity: withSpring(isHeaderHidden.value ? 1 : 0, {
        damping: 20,
        stiffness: 90
      }),
      alignItems: 'center'
    }));

    const openScanner = useCallback(() => {
      sendFirebaseEvent(CustomAppEvents.main_scan);
      scannerBottomSheetRef.current?.show();
    }, []);

    const closeScanner = useCallback(() => {
      scannerBottomSheetRef.current?.dismiss();
    }, []);

    const renderContentCenter = useMemo(() => {
      return activeSessions.length > 0 && <WalletSessionsLabel />;
    }, [activeSessions]);

    const headerContentCenter = useMemo(() => {
      if (headerHidden) {
        return (
          <Animated.View style={animatedContentStyle}>
            <Text
              fontSize={13}
              color={COLORS.neutral500}
              fontFamily="Inter_600SemiBold"
            >
              {StringUtils.formatAddress(wallet?.address ?? '', 5, 5)}
            </Text>
            <Text
              fontSize={17}
              color={COLORS.neutral800}
              fontFamily="Inter_600SemiBold"
            >
              {NumberUtils.numberToTransformedLocale(account?.ambBalance ?? '')}{' '}
              AMB
            </Text>
          </Animated.View>
        );
      } else {
        return renderContentCenter;
      }
    }, [
      account?.ambBalance,
      animatedContentStyle,
      headerHidden,
      renderContentCenter,
      wallet?.address
    ]);

    const onHandleWalletConnectAuthorization = useCallback(
      async (uri: string): Promise<void> => {
        if (!walletKit) {
          closeScanner();
          return;
        }

        try {
          await InteractionManager.runAfterInteractions(async () => {
            try {
              await walletKit.pair({ uri });
            } catch (error) {
              closeScanner();
              setWalletConnectStep(CONNECT_VIEW_STEPS.PAIR_EXPIRED_ERROR);

              await new Promise<void>((resolve) => setTimeout(resolve, 1000));

              InteractionManager.runAfterInteractions(
                onShowWalletConnectBottomSheet
              );
            }
          });
        } catch (error) {
          console.error('Error during wallet connection:', error);
          closeScanner();
        }
      },
      [closeScanner, onShowWalletConnectBottomSheet, setWalletConnectStep]
    );

    const onQRCodeScanned = useCallback(
      (data: string) => {
        const res = data.match(ethereumAddressRegex);
        if (res && res?.length > 0) {
          closeScanner();
          navigation.navigate('Search', {
            screen: 'SearchScreen',
            params: { address: res[0] }
          });
        } else if (data.startsWith('wc:')) {
          onHandleWalletConnectAuthorization(data);
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
      [closeScanner, navigation, onHandleWalletConnectAuthorization, t]
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
          <Spacer horizontal value={scale(25)} />
          <Button onPress={navigateToNotifications}>
            <NotificationBellIcon />
            {newNotificationsCount > 0 && (
              <View style={[styles.notificationCountContainer]}></View>
            )}
          </Button>
        </>
      );
    }, [navigateToNotifications, newNotificationsCount]);

    const renderContentLeft = useMemo(() => {
      return (
        <View style={{ bottom: scale(3) }}>
          <Button onPress={openScanner}>
            <BarcodeScannerIcon />
          </Button>
          <BottomSheet
            height={WINDOW_HEIGHT}
            ref={scannerBottomSheetRef}
            borderRadius={0}
          >
            <BarcodeScanner
              onScanned={onQRCodeScanned}
              onClose={closeScanner}
            />
          </BottomSheet>
        </View>
      );
    }, [WINDOW_HEIGHT, closeScanner, onQRCodeScanned, openScanner]);

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
        contentCenter={headerContentCenter}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.culturedWhite,
    backgroundColor: 'white'
  },
  notificationCountContainer: {
    position: 'absolute',
    backgroundColor: COLORS.yellow500,
    right: -3,
    top: -3,
    borderRadius: scale(11),
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
