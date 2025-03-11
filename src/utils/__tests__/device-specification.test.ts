import { Dimensions } from 'react-native';
import { isSmallScreen } from '@utils/deviceSpecification';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 667 })
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((platform) => platform.ios)
  }
}));

describe('isSmallScreen', () => {
  const setDimensions = (width: number, height: number) => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width, height });
  };

  it('should return true for small screen height', () => {
    setDimensions(375, 667);
    expect(isSmallScreen).toBe(true);
  });
});
