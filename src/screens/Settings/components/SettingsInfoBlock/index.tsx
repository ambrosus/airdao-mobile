import { Row, Text } from '@components/base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { AirDAOIcon } from '@components/svg/AirDAOIcon';
import { HelpIcon } from '@components/svg/HelpIcon';
import { AppStoreIcon } from '@components/svg/AppStoreIcon';

export const SettingsInfoBlock = () => {
  return (
    <View style={styles.container}>
      <Row style={styles.infoContainer}>
        <AirDAOIcon />
        <Text style={styles.infoTextContainer}>About AirDAO</Text>
      </Row>
      <Row style={styles.infoContainer}>
        <HelpIcon />
        <Text style={styles.infoTextContainer}>Help center</Text>
      </Row>
      <Row style={styles.infoContainer}>
        <AppStoreIcon />
        <Text style={styles.infoTextContainer}>Rate us on the App Store</Text>
      </Row>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 35
  },
  infoContainer: {
    flexDirection: 'row',
    paddingBottom: 35
  },
  infoTextContainer: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.black,
    paddingLeft: 12
  }
});
