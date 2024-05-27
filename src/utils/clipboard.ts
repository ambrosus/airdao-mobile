import * as ExpoClipboard from 'expo-clipboard';

const copyToClipboard = async (string: string) => {
  return await ExpoClipboard.setStringAsync(string);
};

const getClipboardString = async () => {
  if (await ExpoClipboard.hasStringAsync()) {
    return await ExpoClipboard.getStringAsync();
  }
};

export const Clipboard = { copyToClipboard, getClipboardString };
