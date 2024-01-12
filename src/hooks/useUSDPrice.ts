import { useEffect, useState } from 'react';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { useCurrencyRate } from './query/useCurrencyRate';

/**
 *
 * @param {number} etherAmount amount of tokens
 * @param {AirDAODictTypes.Code} symbol Symbol of crypto token to convert into USD.  (Default value: AMB)
 * @returns {number} USD price of given amount of tokens
 */
export const useUSDPrice = (
  etherAmount: number,
  symbol: AirDAODictTypes.Code = AirDAODictTypes.Code.AMB
): number => {
  const currencyRate = useCurrencyRate(symbol);
  const [usdPrice, setUSDPrice] = useState(0);
  useEffect(() => {
    setUSDPrice(parseFloat((etherAmount * currencyRate).toFixed(6)));
  }, [currencyRate, etherAmount]);

  return usdPrice;
};
