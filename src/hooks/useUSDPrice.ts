import { useEffect, useState } from 'react';
import { useCurrencyRate } from '@hooks/query';
import { CryptoCurrencyCode } from '@appTypes';

/**
 *
 * @param {number} etherAmount amount of tokens
 * @param {CryptoCurrencyCode} symbol Symbol of crypto token to convert into USD.  (Default value: AMB)
 * @returns {number} USD price of given amount of tokens
 */
export const useUSDPrice = (
  etherAmount: number,
  symbol: CryptoCurrencyCode = CryptoCurrencyCode.AMB
): number => {
  const currencyRate = useCurrencyRate(symbol);
  const [usdPrice, setUSDPrice] = useState(0);
  useEffect(() => {
    setUSDPrice(parseFloat((etherAmount * currencyRate).toFixed(6)));
  }, [currencyRate, etherAmount]);

  return usdPrice;
};
