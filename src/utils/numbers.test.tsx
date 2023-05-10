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
    expect(NumberUtils.formatNumber(undefined)).toBe('');
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
});
