import { moderateScale, scale, verticalScale } from '@utils/scaling';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 2000, height: 1222 })
  }
}));

describe('ScalingUtils', () => {
  it('should correctly calculate the scaled value', () => {
    const result = scale(10);
    expect(result).toBeCloseTo(53.3333333333333);
  });
  it('should correctly calculate the vertical scaled value', () => {
    const result = verticalScale(20);
    expect(result).toBeCloseTo(30.098522167487687);
  });

  it('should correctly calculate the moderate scaled value with default factor', () => {
    const result = moderateScale(15);
    expect(result).toBeCloseTo(47.5);
  });

  it('should correctly calculate the moderate scaled value with custom factor', () => {
    const result = moderateScale(15, 0.3);
    expect(result).toBeCloseTo(34.5);
  });
});
