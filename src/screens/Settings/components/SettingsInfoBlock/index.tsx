import { Button, Row, Spacer, Text } from '@components/base';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
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

  return (
    <>
      <View testID="setting-screen_settings-info-block">
        <Spacer value={42} />
        <Button type="base" onLongPress={openClearCacheModal}>
          <Row>
            <HelpIcon />
            <Text style={styles.infoTextContainer}>Help center</Text>
          </Row>
        </Button>
        <Spacer value={43} />
        <Button type="base">
          <Row>
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
