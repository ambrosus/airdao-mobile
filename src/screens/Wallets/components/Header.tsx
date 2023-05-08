import React, { useCallback, useMemo, useRef } from 'react';
import { Alert, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { NotificationIcon, ScannerIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { Button, Spacer, Text } from '@components/base';
import { WalletsNavigationProp } from '@appTypes/navigation';
import { BarcodeScanner } from '@components/templates';
import { etherumAddressRegex } from '@constants/regex';
import { OnboardingView } from '@components/templates/OnboardingView';

export function WalletHeader(): JSX.Element {
  const navigation = useNavigation<WalletsNavigationProp>();
  const unreadNotificationCount = 2;
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const scanner = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);

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
        navigation.navigate('Explore', {
          screen: 'ExploreScreen',
          params: { address: res[0] }
        });
      } else if (!scanned.current) {
        scanned.current = true;
        Alert.alert('Invalid QR Code', '', [
          {
            text: 'Scan Again',
            onPress: () => {
              scanned.current = false;
            }
          }
        ]);
      }
    },
    [navigation]
  );

  const navigateToNotifications = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const renderContentRight = useMemo(() => {
    return (
      <>
        <OnboardingView
          thisStep={12}
          childrenAlwaysVisible
          tooltipPlacement="bottom"
          helpers={{ next: openScanner }}
        >
          <Button
            onPress={() => {
              openScanner();
            }}
          >
            <ScannerIcon color={COLORS.white} />
          </Button>
        </OnboardingView>
        <Spacer horizontal value={scale(20)} />
        <Button onPress={navigateToNotifications}>
          <NotificationIcon color={COLORS.white} />
          {unreadNotificationCount > 0 && (
            <View style={styles.notificationCountContainer}>
              <Text subtext>{unreadNotificationCount}</Text>
            </View>
          )}
        </Button>
        <BottomSheet height={WINDOW_HEIGHT} ref={scanner}>
          <BarcodeScanner onScanned={onQRCodeScanned} onClose={closeScanner} />
        </BottomSheet>
      </>
    );
  }, [WINDOW_HEIGHT, navigateToNotifications, onQRCodeScanned]);

  return (
    <Header
      backIconVisible={false}
      style={styles.container}
      contentRight={renderContentRight}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  notificationCountContainer: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    right: 0,
    top: -verticalScale(4),
    borderRadius: scale(7),
    width: scale(14),
    height: scale(14),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
