import { NumberUtils } from '@utils/number';

describe('NumberUtils', () => {
  it('formats a number with commas and decimal places', () => {
    expect(NumberUtils.formatNumber(10000, 2)).toBe('10,000.00');
    expect(NumberUtils.formatNumber(10000, 3)).toBe('10,000.000');
    expect(NumberUtils.formatNumber(10000, 4)).toBe('10,000.0000');
    expect(NumberUtils.formatNumber(100000, 2)).toBe('100,000.00');
    expect(NumberUtils.formatNumber(1000000, 2)).toBe('1,000,000.00');
    expect(NumberUtils.formatNumber(1000000000, 2)).toBe('1,000,000,000.00');
    expect(NumberUtils.formatNumber(1000000000000, 2)).toBe(
      '1,000,000,000,000.00'
    );
  });

  it('handles undefined and null input', () => {
    // @ts-ignore
    expect(NumberUtils.formatNumber(undefined)).toBe('');
    // @ts-ignore
    expect(NumberUtils.formatNumber(null)).toBe('');
  });

  it('adds a plus sign to positive numbers', () => {
    expect(NumberUtils.addSignToNumber(100)).toBe('+100');
  });

  it('adds a minus sign to negative numbers', () => {
    expect(NumberUtils.addSignToNumber(-100)).toBe('--100');
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
