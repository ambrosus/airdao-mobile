import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring
} from 'react-native-reanimated';
import { HomeNavigationProp } from '@appTypes/navigation';
import { Button, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import {
  BarcodeScannerIcon,
  NotificationBellIcon
} from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { useWalletStore } from '@entities/wallet';
import {
  useBarcode,
  useNewNotificationsCount
} from '@features/wallet-assets/lib/hooks';
import { WalletSessionsLabel } from '@features/wallet-connect/components/composite';
import { useConnectionsController } from '@features/wallet-connect/lib/hooks';
import { useNotificationsQuery } from '@hooks';
import { Cache, CacheKey } from '@lib/cache';

import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { ExplorerAccount } from '@models';
import { NumberUtils, StringUtils, scale } from '@utils';
import { styles } from './styles';

interface HomeHeaderProps {
  account: ExplorerAccount | null;
  isHeaderHidden: SharedValue<boolean>;
}

export const HomeHeader = React.memo(
  ({ account, isHeaderHidden }: HomeHeaderProps): JSX.Element => {
    const navigation = useNavigation<HomeNavigationProp>();

    const { wallet } = useWalletStore();
    const { data: notifications } = useNotificationsQuery();
    const newNotificationsCount = useNewNotificationsCount();
    const { onShowBarcodeContainer } = useBarcode();
    const sessionsPerAddress = useConnectionsController();

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

    const renderContentCenter = useMemo(() => {
      return sessionsPerAddress.length > 0 && <WalletSessionsLabel />;
    }, [sessionsPerAddress]);

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

    const openScanner = useCallback(() => {
      sendFirebaseEvent(CustomAppEvents.main_scan);
      // scannerBottomSheetRef.current?.show();
      onShowBarcodeContainer();
    }, [onShowBarcodeContainer]);

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
        </View>
      );
    }, [openScanner]);

    return (
      <Header
        bottomBorder
        backIconVisible={false}
        style={styles.container}
        contentRight={renderContentRight}
        contentLeft={renderContentLeft}
        contentCenter={headerContentCenter}
      />
    );
  }
);
