import { Platform } from 'react-native';
import * as ExpoSharing from 'expo-sharing';
import Share from 'react-native-share';
import { ShareUtils } from '@utils/share';

jest.mock('react-native-share', () => ({
  shareSingle: jest.fn()
}));

jest.mock('expo-sharing');

let mockOptions = {
  title: 'dummy-title',
  message: 'image-message',
  uri: 'image-uri'
};

describe('ShareUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shareImage', () => {
    it('should call ExpoSharing.shareAsync with the correct arguments', async () => {
      mockOptions = {
        title: 'dummy-title',
        message: '',
        uri: 'image-uri'
      };
      const expectedResult = 'expected-result';
      (ExpoSharing.shareAsync as jest.Mock).mockResolvedValue(expectedResult);
      const result = await ShareUtils.shareImage(mockOptions);
      expect(ExpoSharing.shareAsync).toHaveBeenCalledWith(mockOptions.uri, {
        UTI: 'image/jpeg',
        mimeType: 'image/jpeg',
        dialogTitle: 'Check out price!'
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('socialShareImage', () => {
    it('should call Share.shareSingle with the correct arguments for iOS', async () => {
      mockOptions = {
        title: 'dummy-title',
        message: 'image-message',
        uri: 'image-uri'
      };
      const mockSocial = 'sms';
      jest.spyOn(Platform, 'select').mockReturnValueOnce('file://image-uri');
      // @ts-ignore
      await ShareUtils.socialShareImage(mockOptions, mockSocial);
      expect(Share.shareSingle).toHaveBeenCalledWith({
        title: mockOptions.title,
        message: mockOptions.message,
        url: 'file://image-uri',
        subject: mockOptions.message,
        social: mockSocial,
        recipient: ''
      });
    });

    it('should call Share.shareSingle with the correct arguments for Android', async () => {
      mockOptions = {
        title: 'dummy-title',
        message: 'image-message',
        uri: 'image-uri'
      };
      const mockSocial = 'twitter';
      jest.spyOn(Platform, 'select').mockReturnValueOnce('image-uri');
      // @ts-ignore
      await ShareUtils.socialShareImage(mockOptions, mockSocial);
      expect(Share.shareSingle).toHaveBeenCalledWith({
        title: mockOptions.title,
        message: mockOptions.message,
        url: 'image-uri',
        subject: mockOptions.message,
        social: mockSocial,
        recipient: ''
      });
    });
  });
});
