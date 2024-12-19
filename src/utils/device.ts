import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Updates from 'expo-updates';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const reloadApp = async () => {
  return await Updates.reloadAsync();
};

const getSupportedBiometrics = async () => {
  return await LocalAuthentication.supportedAuthenticationTypesAsync();
};

const checkFaceIDExists = async () => {
  const supportedBiometrics = await getSupportedBiometrics();
  return (
    supportedBiometrics.indexOf(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    ) > -1
  );
};

const checkFingerprintExists = async () => {
  const supportedBiometrics = await getSupportedBiometrics();
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
  getSupportedBiometrics,
  checkFaceIDExists,
  checkFingerprintExists
};
