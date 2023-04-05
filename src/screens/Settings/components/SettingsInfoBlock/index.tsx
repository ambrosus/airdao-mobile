import { Button, Row, Text } from '@components/base';
import React from 'react';
import { View } from 'react-native';
import { LogoSVG } from '@components/svg/icons';
import { HelpIcon } from '@components/svg/icons/Help';
import { AppStoreIcon } from '@components/svg/icons/AppStore';
import { styles } from './style';

export const SettingsInfoBlock = () => {
  return (
    <View style={styles.container}>
      <Button type="base">
        <Row style={styles.infoContainer}>
          <LogoSVG />
          <Text style={styles.infoTextContainer}>About AirDAO</Text>
        </Row>
      </Button>
      <Button type="base">
        <Row style={styles.infoContainer}>
          <HelpIcon />
          <Text style={styles.infoTextContainer}>Help center</Text>
        </Row>
      </Button>
      <Button type="base">
        <Row style={styles.infoContainer}>
          <AppStoreIcon />
          <Text style={styles.infoTextContainer}>Rate us on the App Store</Text>
        </Row>
      </Button>
    </View>
  );
};
