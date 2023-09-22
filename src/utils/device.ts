import { Platform } from 'react-native';
import * as Updates from 'expo-updates';
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const reloadApp = async () => {
  return await Updates.reloadAsync();
};

export const DeviceUtils = { isAndroid, isIOS, reloadApp };
