import { NumberUtils } from '@utils/number';

describe('NumberUtils', () => {
  it('should format positive numbers correctly', () => {
    expect(NumberUtils.formatNumber(10000, 2)).toBe('10,000');
    expect(NumberUtils.formatNumber(30363.564, 2)).toBe('30,363.56');
    expect(NumberUtils.formatNumber(0.3634552345262345, 2)).toBe('0.36');
  });

  it('should format negative numbers correctly', () => {
    expect(NumberUtils.formatNumber(-10000, 2)).toBe('-10,000');
    expect(NumberUtils.formatNumber(-30363.564, 2)).toBe('-30,363.56');
  });

  it('should return empty string for undefined or null', () => {
    // @ts-ignore
    expect(NumberUtils.formatNumber(undefined)).toBe('');
    // @ts-ignore
    expect(NumberUtils.formatNumber(null)).toBe('');
  });

  it('should handle zero correctly', () => {
    expect(NumberUtils.formatNumber(0, 2)).toBe('0');
  });

  it('should limit decimal places correctly', () => {
    expect(NumberUtils.formatNumber(1234.5678, 3)).toBe('1,234.567');
    expect(NumberUtils.formatNumber(1234.5, 1)).toBe('1,234.5');
  });

  it('adds a plus sign to positive numbers', () => {
    expect(NumberUtils.addSignToNumber(100)).toBe('+100');
  });

  it('adds a minus sign to negative numbers', () => {
    expect(NumberUtils.addSignToNumber(-100)).toBe('-100');
  });

  it('doesnt add a sign to zero', () => {
    expect(NumberUtils.addSignToNumber(0)).toBe('-0');
  });

  it('numberToTransformLocale | formats numbers according to locale rules', () => {
    expect(NumberUtils.numberToTransformedLocale(123.0)).toBe('123');
    expect(NumberUtils.numberToTransformedLocale(123.4)).toBe('123.4');
    expect(NumberUtils.numberToTransformedLocale(123.41)).toBe('123.41');
    expect(NumberUtils.numberToTransformedLocale(1234.0)).toBe('1,234');
    expect(NumberUtils.numberToTransformedLocale(1234.56)).toBe('1,234.56');
  });
});