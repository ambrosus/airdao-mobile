import { CryptoCurrencyCode } from '@appTypes';
import { useCurrencySelector } from '@entities/currencies/lib/hooks/use-currency-selector';

/**
 *
 * @param {number} etherAmount amount of tokens
 * @param {CryptoCurrencyCode} symbol Symbol of crypto token to convert into USD.  (Default value: AMB)
 * @returns {number | NaN} USD price of given amount of tokens
 */
export const useUSDPrice = (
  etherAmount: number,
  symbol: CryptoCurrencyCode | string = CryptoCurrencyCode.AMB
): number => {
  return useCurrencySelector(etherAmount, symbol);
};
