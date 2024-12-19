import { moderateScale, scale, verticalScale } from '@utils/scaling';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 2000, height: 1222 })
  }
}));

describe('ScalingUtils', () => {
  it('should correctly calculate the scaled value', () => {
    const result = scale(10);
    expect(result).toBe(57.142857142857146);
  });
  it('should correctly calculate the vertical scaled value', () => {
    const result = verticalScale(20);
    expect(result).toBeCloseTo(35.94117647058824);
  });

  it('should correctly calculate the moderate scaled value with default factor', () => {
    const result = moderateScale(15);
    expect(result).toBeCloseTo(50.35714285714286);
  });

  it('should correctly calculate the moderate scaled value with custom factor', () => {
    const result = moderateScale(15, 0.3);
    expect(result).toBeCloseTo(36.214285714285715);
  });
});
