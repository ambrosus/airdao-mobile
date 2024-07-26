import { useState, useEffect, useCallback } from 'react';
import { TxType } from '@features/kosmos/types';
import { useBridgeContextData } from '@contexts/Bridge';
import { fetchMarketTransactions } from '@features/kosmos/api';

const VERSIONS = ['v1', 'v2'];

export function useTransactions() {
  const { selectedAccount } = useBridgeContextData();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TxType[]>([]);

  const fetchTransactions = useCallback(() => {
    if (!selectedAccount?.address) return;

    const controller = new AbortController();

    if (transactions.length === 0) setLoading(true);
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
      setLoading(false);
    });
  }, [selectedAccount, transactions.length]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    isTransactionsLoading: loading,
    transactions,
    refetchTransactions: fetchTransactions
  };
}
