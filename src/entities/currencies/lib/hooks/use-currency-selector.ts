import { useMemo } from 'react';
import { useCurrenciesStore } from '@entities/currencies/model';
import { lowerCase } from 'lodash';

export function useCurrencySelector(amount: number | string, symbol: string) {
  const { currencies } = useCurrenciesStore();

  return useMemo(() => {
    const token = currencies.find((token) =>
      lowerCase(token.symbol).includes(lowerCase(symbol))
    );

    if (token?.bestUSDPrice) {
      return +token?.bestUSDPrice * +amount;
    }

    return NaN;
  }, [amount, currencies, symbol]);
}
