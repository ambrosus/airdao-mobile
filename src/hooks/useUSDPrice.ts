import { useEffect, useState } from 'react';
import { useAMBPrice } from './query';

export const useUSDPrice = (amb: number): number => {
  const { data: ambPrice } = useAMBPrice();
  const [usdPrice, setUSDPrice] = useState(0);
  useEffect(() => {
    setUSDPrice(amb * (ambPrice?.priceUSD || 0));
  }, [ambPrice, amb]);

  return usdPrice;
};
