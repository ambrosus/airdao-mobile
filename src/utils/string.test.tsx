import { StringUtils } from '@utils/string';

describe('StringUtils', () => {
  describe('formatAddress', () => {
    it('truncates the address based on the given padding', () => {
      expect(StringUtils.formatAddress('1234 Main St', 2, 2)).toBe('12.. St');
      expect(StringUtils.formatAddress('1234 Main St', 3, 1)).toBe('123...t');
      expect(StringUtils.formatAddress('1234 Main St', 0, 4)).toBe('....St');
    });

    it('replaces truncated characters with dots', () => {
      expect(StringUtils.formatAddress('1234 Main St', 2, 2)).toBe('12.. St');
      expect(StringUtils.formatAddress('1234 Main St', 3, 1)).toBe('123...t');
      expect(StringUtils.formatAddress('1234 Main St', 0, 4)).toBe('....St');
    });

    it('handles cases where the padding is greater than or equal to the length of the address', () => {
      expect(StringUtils.formatAddress('1234 Main St', 20, 20)).toBe(
        '1234 Main St'
      );
      expect(StringUtils.formatAddress('1234 Main St', 10, 10)).toBe(
        '1234 Main St'
      );
      expect(StringUtils.formatAddress('1234 Main St', 5, 5)).toBe(
        '1234 Main St'
      );
    });
  });

  describe('pluralize', () => {
    it('adds an "s" to the end of a string if the count is greater than 1', () => {
      expect(StringUtils.pluralize(0, 'cat')).toBe('0 cats');
      expect(StringUtils.pluralize(1, 'cat')).toBe('1 cat');
      expect(StringUtils.pluralize(2, 'cat')).toBe('2 cats');
      expect(StringUtils.pluralize(0, 'person', 'people')).toBe('0 people');
      expect(StringUtils.pluralize(1, 'person', 'people')).toBe('1 person');
      expect(StringUtils.pluralize(2, 'person', 'people')).toBe('2 people');
    });

    it('does not add an "s" to the end of a string if the count is 1', () => {
      expect(StringUtils.pluralize(1, 'cat')).toBe('1 cat');
      expect(StringUtils.pluralize(1, 'person', 'people')).toBe('1 person');
    });
  });
});
