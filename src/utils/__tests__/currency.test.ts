import { CurrencyUtils } from '@utils/currency';

describe('CurrencyUtils', () => {
  test('toCrypto should convert USD to crypto correctly', () => {
    const usd = 100;
    const rate = 2;
    const result = CurrencyUtils.toCrypto(usd, rate);
    expect(result).toBe(50); // 100 / 2 = 50
  });

  test('toUSD should convert crypto to USD correctly', () => {
    const crypto = 50;
    const rate = 2;
    const result = CurrencyUtils.toUSD(crypto, rate);
    expect(result).toBe(100); // 50 * 2 = 100
  });
});
