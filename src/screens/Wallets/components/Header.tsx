import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Header } from '@components/composite';
import { NotificationIcon, ScannerIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { Button, Text } from '@components/base';

export function WalletHeader(): JSX.Element {
  const unreadNotificationCount = 2;

  const oepnScanner = () => {
    // TODO
  };

  const navigateToNotifications = () => {
    // TODO
  };

  const renderContentRight = () => {
    return (
      <>
        <Button onPress={oepnScanner}>
          <ScannerIcon color={COLORS.white} />
        </Button>
        <Button onPress={navigateToNotifications}>
          <NotificationIcon color={COLORS.white} />
          {unreadNotificationCount > 0 && (
            <View style={styles.notificationCountContainer}>
              <Text subtext>{unreadNotificationCount}</Text>
            </View>
          )}
        </Button>
      </>
    );
  };

  return (
    <Header
      backIconVisible={false}
      style={styles.container}
      contentRight={renderContentRight()}
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
