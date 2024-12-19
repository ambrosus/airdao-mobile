import * as ExpoClipboard from 'expo-clipboard';
import { Clipboard } from '@utils/clipboard';

jest.mock('expo-clipboard');

describe('Clipboard Utility', () => {
  it('should copy string to clipboard', async () => {
    const testString = 'Hello, World!';
    await Clipboard.copyToClipboard(testString);
    expect(ExpoClipboard.setStringAsync).toHaveBeenCalledWith(testString);
  });

  it('should get string from clipboard', async () => {
    const mockString = 'Hello, World!';
    (ExpoClipboard.getStringAsync as jest.Mock).mockResolvedValue(mockString);

    const result = await Clipboard.getClipboardString();
    expect(result).toBe(mockString);
  });
});
