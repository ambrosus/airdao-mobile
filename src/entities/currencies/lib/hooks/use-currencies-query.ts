import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CURRENCIES_QUERY } from '@entities/currencies/lib/currencies.graph';
import { useCurrenciesStore } from '@entities/currencies/model';
import { AwaitCurrencyResponse } from '@entities/currencies/types';

export function useCurrenciesQuery() {
  const { onSetCurrencies } = useCurrenciesStore();
  const { data, refetch } = useQuery<AwaitCurrencyResponse>(
    GET_CURRENCIES_QUERY,
    {
      pollInterval: 3 * 60 * 1e3
    }
  );

  useEffect(() => {
    if (data?.tokens && data.tokens.length > 0) {
      onSetCurrencies(data.tokens);
    }
  }, [data, onSetCurrencies]);

  return { onRefetchCurrenciesList: refetch };
}
