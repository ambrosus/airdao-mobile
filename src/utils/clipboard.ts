import * as ExpoClipboard from 'expo-clipboard';

const copyToClipboard = async (string: string) => {
  return await ExpoClipboard.setStringAsync(string);
};

const getClipboardString = async () => {
  return ExpoClipboard.getStringAsync().then((r) => r);
};

export const Clipboard = { copyToClipboard, getClipboardString };
