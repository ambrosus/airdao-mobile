import { useMemo } from 'react';
import { lowerCase } from 'lodash';
import { useCurrenciesStore } from '@entities/currencies/model';

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
