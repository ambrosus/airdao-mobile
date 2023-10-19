import { useEffect, useState } from 'react';
import { useAMBPrice } from './query';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

export const useUSDPrice = (
  etherAmount: number,
  symbol: AirDAODictTypes.Code = AirDAODictTypes.Code.AMB
): number => {
  const { data: ambPrice } = useAMBPrice();
  const [usdPrice, setUSDPrice] = useState(0);
  useEffect(() => {
    let usdPrice = 0;
    switch (symbol) {
      case AirDAODictTypes.Code.BUSD: {
        usdPrice = etherAmount;
        break;
      }
      default:
        usdPrice = etherAmount * (ambPrice?.priceUSD || 0);
        break;
    }
    setUSDPrice(usdPrice);
  }, [ambPrice, etherAmount, symbol]);

  return usdPrice;
};
