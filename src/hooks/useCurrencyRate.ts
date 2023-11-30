import { useEffect, useState } from 'react';
import { useAMBPrice } from './query';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

export const useCurrencyRate = (
  symbol: AirDAODictTypes.Code = AirDAODictTypes.Code.AMB
): number => {
  const { data: ambPrice } = useAMBPrice();
  const [currencyRate, setCurrencyRate] = useState(0);
  useEffect(() => {
    let _currencyRate = 1;
    switch (symbol) {
      case AirDAODictTypes.Code.BUSD: {
        _currencyRate = 1;
        break;
      }
      default:
        _currencyRate = ambPrice?.priceUSD || 0;
        break;
    }
    setCurrencyRate(_currencyRate);
  }, [ambPrice, symbol]);

  return currencyRate;
};
