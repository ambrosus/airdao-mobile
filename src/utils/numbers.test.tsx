import { NumberUtils } from '@utils/number';

describe('NumberUtils', () => {
  describe('formatNumber', () => {
    it('formats a number with commas and decimal places', () => {
      expect(NumberUtils.formatNumber(10000, 2)).toBe('10,000.00');
    });

    it('handles undefined and null input', () => {
      expect(NumberUtils.formatNumber(undefined)).toBe('');
      expect(NumberUtils.formatNumber(null)).toBe('');
    });
  });

  describe('addSignToNumber', () => {
    it('adds a plus sign to positive numbers', () => {
      expect(NumberUtils.addSignToNumber(10)).toBe('+10');
    });

    it('adds a minus sign to negative numbers', () => {
      expect(NumberUtils.addSignToNumber(-10)).toBe('-10');
    });

    it('does not add a sign to zero', () => {
      expect(NumberUtils.addSignToNumber(0)).toBe('0');
    });
  });
});
