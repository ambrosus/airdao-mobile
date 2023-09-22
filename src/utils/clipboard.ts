import * as ExpoClipboard from 'expo-clipboard';

const copyToClipboard = async (string: string) => {
  return await ExpoClipboard.setStringAsync(string);
};

export const Clipboard = { copyToClipboard };
