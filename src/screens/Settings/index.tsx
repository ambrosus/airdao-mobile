import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { scale, verticalScale } from '@utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Row, Spacer, Switch, Text } from '@components/base';
import * as LocalAuthentication from 'expo-local-authentication';

export const SettingsScreen = () => {
  const { top } = useSafeAreaInsets();
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState<boolean>(false);

  const toggleFaceIDAuthentication = async () => {
    try {
      if (isFaceIDEnabled) {
        await LocalAuthentication.cancelAuthenticate();
      } else {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with Face ID'
          });
          if (result.success) {
            setIsFaceIDEnabled(true);
          }
        } else {
          // TODO
        }
      }
    } catch (error) {
      console.error('Error toggling Face ID:', error);
    }
  };

  return (
    <View style={[{ top }, styles.container]} testID="Settings_Screen">
      <SettingsBlock />
      <View style={styles.separator} />
      <SettingsInfoBlock />
      <Spacer value={verticalScale(24)} />
      <Row alignItems="center">
        <Text>Face ID</Text>
        <Spacer horizontal value={verticalScale(12)} />
        <Switch
          value={isFaceIDEnabled}
          onValueChange={toggleFaceIDAuthentication}
        />
      </Row>
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
