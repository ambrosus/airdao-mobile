import { useState, useEffect, useCallback } from 'react';
import { TxType } from '@features/kosmos/types';
import { useBridgeContextData } from '@contexts/Bridge';
import { fetchMarketTransactions } from '@features/kosmos/api';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

const VERSIONS = ['v1', 'v2'];

export function useTransactions() {
  const { transactions, setTransactions } = useKosmosMarketsContextSelector();
  const { selectedAccount } = useBridgeContextData();
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!selectedAccount?.address) return;

    const controller = new AbortController();

    Promise.all(
      VERSIONS.map(async (version) => {
        const response = await fetchMarketTransactions(
          version,
          selectedAccount.address,
          controller
        );
        return response.data.map((tx: TxType) => ({ ...tx, version: version }));
      })
    ).then((response) => {
      setTransactions([...response[0], ...response[1]]);
    });
  }, [selectedAccount, setTransactions]);

  useEffect(() => {
    if (transactions.length === 0) {
      setLoading(true);
      fetchTransactions();
      setLoading(false);
    }
  }, [fetchTransactions, selectedAccount, transactions.length]);

  return {
    isTransactionsLoading: loading,
    refetchTransactions: fetchTransactions
  };
}
