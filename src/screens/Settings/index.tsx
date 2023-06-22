import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { scale } from '@utils/scaling';
import { Spacer, Text } from '@components/base';
import * as Updates from 'expo-updates';
import messaging from '@react-native-firebase/messaging';
import { CopyToClipboardButton } from '@components/composite';

export const SettingsScreen = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    messaging().getToken().then(setToken);
  }, []);

  return (
    <SafeAreaView style={styles.container} testID="settings-screen">
      <SettingsBlock />
      <View style={styles.separator} />
      <SettingsInfoBlock />
      <Spacer value={100} />
      <View style={{ paddingHorizontal: 50 }}>
        <CopyToClipboardButton textToDisplay={token} />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: 72
        }}
      >
        <Text>Channel: {Updates.channel}</Text>
        <Text fontSize={12}>AirDAO Testing Build: v1.0.0.15</Text>
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
    flex: 1,
    paddingLeft: scale(19),
    paddingRight: scale(23)
  }
});
