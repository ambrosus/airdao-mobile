import { useEffect, useState } from 'react';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { useCurrencyRate } from './query/useCurrencyRate';

export const useUSDPrice = (
  etherAmount: number,
  symbol: AirDAODictTypes.Code = AirDAODictTypes.Code.AMB
): number => {
  const currencyRate = useCurrencyRate(symbol);
  const [usdPrice, setUSDPrice] = useState(0);
  useEffect(() => {
    setUSDPrice(etherAmount * currencyRate);
  }, [currencyRate, etherAmount]);

  return usdPrice;
};
