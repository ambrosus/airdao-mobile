import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { scale } from '@utils/scaling';

export const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container} testID="settings-screen">
      <SettingsBlock />
      <View style={styles.separator} />
      <SettingsInfoBlock />
      <Spacer value={100} />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: 72
        }}
      >
        <Text>Channel: {Updates.channel}</Text>
        <Text fontSize={12}>AirDAO Testing Build: v1.0.0.11</Text>
      </View>
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
