import { useQuery } from '@apollo/client';
import { GET_CURRENCIES_QUERY } from '@entities/currencies/lib/currencies.graph';
import { AwaitCurrencyResponse } from '@entities/currencies/types';
import { useEffect } from 'react';
import { useCurrenciesStore } from '@entities/currencies/model';

export function useCurrenciesQuery() {
  const { onSetCurrencies } = useCurrenciesStore();
  const { data } = useQuery<AwaitCurrencyResponse>(GET_CURRENCIES_QUERY);

  useEffect(() => {
    if (data?.tokens && data.tokens.length > 0) {
      onSetCurrencies(data.tokens);
    }
  }, [data, onSetCurrencies]);
}
