import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { scale } from '@utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SettingsScreen = () => {
  const { top } = useSafeAreaInsets();
  return (
    <SafeAreaView
      edges={['top']}
      style={styles.container}
      testID="Settings_Screen"
    >
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
