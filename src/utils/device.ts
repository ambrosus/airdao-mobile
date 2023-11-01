import { Platform } from 'react-native';
import * as Updates from 'expo-updates';
import * as LocalAuthentication from 'expo-local-authentication';
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const reloadApp = async () => {
  return await Updates.reloadAsync();
};

const checkFaceIDExists = (
  supportedBiometrics: LocalAuthentication.AuthenticationType[]
) => {
  return (
    supportedBiometrics.indexOf(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    ) > -1
  );
};

const checkFingerprintExists = (
  supportedBiometrics: LocalAuthentication.AuthenticationType[]
) => {
  return (
    supportedBiometrics.indexOf(
      LocalAuthentication.AuthenticationType.FINGERPRINT
    ) > -1
  );
};

export const DeviceUtils = {
  isAndroid,
  isIOS,
  reloadApp,
  checkFaceIDExists,
  checkFingerprintExists
};
