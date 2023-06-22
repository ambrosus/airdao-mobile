import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { scale } from '@utils/scaling';

export const SettingsScreen = () => {
  return (
    <View style={styles.container} testID="settings-screen">
      <SettingsBlock />
      <View style={styles.separator} />
      <SettingsInfoBlock />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    width: '100%'
  },
  container: {
    paddingLeft: scale(19),
    paddingRight: scale(23)
  }
});
