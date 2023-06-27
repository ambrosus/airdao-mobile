import { Button, Row, Spacer, Text } from '@components/base';
import React, { useCallback, useRef } from 'react';
import { Linking, View } from 'react-native';
import { HelpIcon } from '@components/svg/icons/Help';
import { AppStoreIcon } from '@components/svg/icons/AppStore';
import { styles } from './style';
import { ClearCacheModal } from '@screens/Settings/components/SettingsInfoBlock/ClearCacheModal';
import { BottomSheetRef } from '@components/composite';

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
      <View testID="setting-screen_settings-info-block">
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
        <Button type="base">
          <Row alignItems="center">
            <AppStoreIcon />
            <Text style={styles.infoTextContainer}>
              Rate us on the App Store
            </Text>
          </Row>
        </Button>
      </View>
      <ClearCacheModal ref={clearCacheModalRef} />
    </>
  );
};
