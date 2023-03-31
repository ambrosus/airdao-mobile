import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';

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
    backgroundColor: COLORS.silver,
    width: '100%'
  },
  container: { marginHorizontal: 15 }
});
