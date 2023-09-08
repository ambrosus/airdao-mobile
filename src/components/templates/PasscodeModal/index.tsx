import React, { useEffect } from 'react';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export const PasscodeModal = () => {
  useEffect(() => {
    const authenticate = async () => {
      try {
        const { success } = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with Face ID'
        });
        return success;
      } catch (error) {
        console.error('Authentication error:', error);
        return false;
      }
    };
    authenticate();
  }, []);

  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Text align="center" style={{ paddingTop: 200 }}>
        FaceID or Passcode
      </Text>
    </View>
  );
};
