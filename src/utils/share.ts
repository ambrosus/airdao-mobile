import Share from 'react-native-share';
import { Social, SharingOptionsWithMedia } from '@appTypes';
import { Platform } from 'react-native';

const shareImage = async (options: SharingOptionsWithMedia) => {
  console.log({ options });
  await Share.open({
    url: options.uri,
    type: 'image/jpg'
  });
};
const socialShareImage = async (
  options: SharingOptionsWithMedia,
  social: Social
) => {
  await Share.shareSingle({
    title: options.title,
    url: options.base64,
    social
  });
};

export const ShareUtils = { shareImage, socialShareImage };
