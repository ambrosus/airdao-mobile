import { Button, Row, Spacer, Text } from '@components/base';
import React, { useCallback, useRef } from 'react';
import { Linking, Platform, View } from 'react-native';
import { HelpIcon } from '@components/svg/icons/Help';
import { AppStoreIcon, PlayStoreIcon } from '@components/svg/icons';
import { styles } from './style';
import { ClearCacheModal } from '@screens/Settings/components/SettingsInfoBlock/ClearCacheModal';
import { BottomSheetRef } from '@components/composite';
import { PlatformSpecificUtils } from '@utils/platform';

export const SettingsInfoBlock = () => {
  const clearCacheModalRef = useRef<BottomSheetRef>(null);
  const openClearCacheModal = useCallback(() => {
    clearCacheModalRef.current?.show();
  }, []);

  const openLink = () => {
    Linking.openURL('https://airdao.academy/faqs');
  };

  return (
    <>
      <View testID="Settings_Screen_Settings_Info_Block">
        <Spacer value={42} />
        <Button
          type="base"
          onPress={openLink}
          onLongPress={openClearCacheModal}
        >
          <Row alignItems="center">
            <HelpIcon />
            <Text style={styles.infoTextContainer}>Help center</Text>
          </Row>
        </Button>
        <Spacer value={43} />
        <Button type="base" onPress={PlatformSpecificUtils.requestReview}>
          <Row alignItems="center">
            {Platform.select({
              ios: <AppStoreIcon />,
              android: <PlayStoreIcon />
            })}
            <Text style={styles.infoTextContainer}>
              {Platform.select({
                ios: 'Rate us on the App Store',
                android: 'Rate us on the Play Store'
              })}
            </Text>
          </Row>
        </Button>
      </View>
      <ClearCacheModal ref={clearCacheModalRef} />
    </>
  );
};
