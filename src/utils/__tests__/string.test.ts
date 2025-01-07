import { StringUtils } from '@utils/string';

describe('StringUtils', () => {
  describe('formatAddress', () => {
    it('returns the original address when paddingLeft + paddingRight is >= to the address length', () => {
      const address = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
      const paddingLeft = 20;
      const paddingRight = 30;
      const result = StringUtils.formatAddress(
        address,
        paddingLeft,
        paddingRight
      );
      expect(result).toBe(address);
    });

    it('formats the address with dots in the middle when paddingLeft + paddingRight is < than the address length', () => {
      const address = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
      const paddingLeft = 3;
      const paddingRight = 4;
      const result = StringUtils.formatAddress(
        address,
        paddingLeft,
        paddingRight
      );
      expect(result).toBe('0xF...aceC');
    });

    it('formats the address with the specified number of dots in the middle', () => {
      const address = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
      const paddingLeft = 2;
      const paddingRight = 4;
      const dotCount = 2;
      const result = StringUtils.formatAddress(
        address,
        paddingLeft,
        paddingRight,
        dotCount
      );
      expect(result).toBe('0x..aceC');
    });
  });

  describe('pluralize', () => {
    it('returns the singular form when count is 1', () => {
      const count = 1;
      const str = 'Wallet';
      const pluralForm = 'Wallets';
      const result = StringUtils.pluralize(count, str, pluralForm);
      expect(result).toBe('1 Wallet');
    });

    it('returns the plural form when count is > than 1', () => {
      const count = 5;
      const str = 'Wallet';
      const pluralForm = 'Wallets';
      const result = StringUtils.pluralize(count, str, pluralForm);
      expect(result).toBe('5 Wallets');
    });

    it('returns the default plural form when count is > than 1 and no pluralForm is provided', () => {
      const count = 3;
      const str = 'Wallet';
      const result = StringUtils.pluralize(count, str);
      expect(result).toBe('3 Wallets');
    });
  });
});
