import Share from 'react-native-share';
import * as ExpoSharing from 'expo-sharing';
import { Social, SharingOptionsWithMedia } from '@appTypes';
import { Platform } from 'react-native';

const shareImage = async (options: SharingOptionsWithMedia) => {
  return await ExpoSharing.shareAsync(options.uri, {
    UTI: 'image/jpeg',
    mimeType: 'image/jpeg',
    dialogTitle: 'Check out price!'
  });
};
const socialShareImage = async (
  options: SharingOptionsWithMedia,
  social: Social
) => {
  await Share.shareSingle({
    title: options.title,
    message: options.message,
    url: Platform.select({
      ios: 'file://' + options.uri,
      android: options.uri
    }),
    subject: options.message,
    social,
    recipient: '' // this is important for SMS sharing. Leave it empty.
  });
};

export const ShareUtils = { shareImage, socialShareImage };
