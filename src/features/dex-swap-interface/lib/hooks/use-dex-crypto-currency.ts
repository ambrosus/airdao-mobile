import { useCallback } from 'react';
import { CryptoCurrencyCode } from '@appTypes';
import { useCurrencyRate } from '@hooks';

export function useDEXCryptoCurrency(tokenSymbol: string | undefined) {
  const currencyRate = useCurrencyRate(tokenSymbol as CryptoCurrencyCode);

  const calculateUSDPrice = useCallback(
    (amount: number | string) => {
      return parseFloat((+amount * currencyRate).toFixed(6));
    },
    [currencyRate]
  );

  return { calculateUSDPrice };
}
