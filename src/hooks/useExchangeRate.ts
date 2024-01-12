import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { useEffect, useState } from 'react';
import { useAMBPrice } from './query';

export const useExchangeRate = (currency: AirDAODictTypes.Code): number => {
  const { data: ambPrice } = useAMBPrice();
  const [rate, setRate] = useState(0);

  const getExhangeRate = async () => {
    // TODO implement getting exchange rates for different currencies
  };

  useEffect(() => {
    getExhangeRate();
  }, [currency]);

  useEffect(() => {
    if (ambPrice) {
      if (currency === AirDAODictTypes.Code.AMB) setRate(ambPrice?.priceUSD);
    }
  }, [currency, ambPrice]);

  return rate;
};
