import { Button, Row, Spacer, Text } from '@components/base';
import React from 'react';
import { View } from 'react-native';
import { HelpIcon } from '@components/svg/icons/Help';
import { AppStoreIcon } from '@components/svg/icons/AppStore';
import { styles } from './style';

export const SettingsInfoBlock = () => {
  return (
    <View testID="setting-screen_settings-info-block">
      <Spacer value={42} />
      <Button type="base">
        <Row>
          <HelpIcon />
          <Text style={styles.infoTextContainer}>Help center</Text>
        </Row>
      </Button>
      <Spacer value={43} />
      <Button type="base">
        <Row>
          <AppStoreIcon />
          <Text style={styles.infoTextContainer}>Rate us on the App Store</Text>
        </Row>
      </Button>
    </View>
  );
};
