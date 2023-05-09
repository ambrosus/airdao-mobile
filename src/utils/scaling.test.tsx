import { moderateScale, scale, verticalScale } from '@utils/scaling';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 667 })
  }
}));

describe('YourComponent', () => {
  describe('scale', () => {
    it('should correctly calculate the scaled value', () => {
      const result = scale(10);
      expect(result).toBeCloseTo(18.75);
    });
  });

  describe('verticalScale', () => {
    it('should correctly calculate the vertical scaled value', () => {
      const result = verticalScale(20);
      expect(result).toBeCloseTo(19.44);
    });
  });

  describe('moderateScale', () => {
    it('should correctly calculate the moderate scaled value with default factor', () => {
      const result = moderateScale(15);
      expect(result).toBeCloseTo(16.25);
    });

    it('should correctly calculate the moderate scaled value with custom factor', () => {
      const result = moderateScale(15, 0.3);
      expect(result).toBeCloseTo(16.5);
    });
  });
});
