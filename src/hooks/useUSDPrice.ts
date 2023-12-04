import { useEffect, useState } from 'react';
import { useAMBPrice } from './query';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { useCurrencyRate } from './useCurrencyRate';

export const useUSDPrice = (
  etherAmount: number,
  symbol: AirDAODictTypes.Code = AirDAODictTypes.Code.AMB
): number => {
  const { data: ambPrice } = useAMBPrice();
  const currencyRate = useCurrencyRate(symbol);
  const [usdPrice, setUSDPrice] = useState(0);
  useEffect(() => {
    setUSDPrice(etherAmount * currencyRate);
  }, [ambPrice, currencyRate, etherAmount, symbol]);

  return usdPrice;
};
