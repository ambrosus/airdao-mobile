import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { scale } from '@utils/scaling';

export const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsBlock />
      <View style={styles.separator} />
      <SettingsInfoBlock />
    </SafeAreaView>
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
