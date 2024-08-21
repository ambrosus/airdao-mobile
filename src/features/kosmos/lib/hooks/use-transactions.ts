import { useState, useEffect, useCallback } from 'react';
import { TxType } from '@features/kosmos/types';
import { fetchMarketTransactions } from '@features/kosmos/api';
import { useBridgeContextData } from '@features/bridge/context';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

const VERSIONS = ['v1', 'v2'];

export function useTransactions() {
  const { selectedAccount } = useBridgeContextData();
  const [loading, setLoading] = useState(false);
  const { transactions, setTransactions } = useKosmosMarketsContextSelector();

  const fetchTransactions = useCallback(() => {
    if (!selectedAccount?.address) return;

    const controller = new AbortController();

    setLoading(true);
    Promise.all(
      VERSIONS.map(async (version) => {
        const response = await fetchMarketTransactions(
          version,
          selectedAccount.address,
          controller
        );
        return response.data.map((tx: TxType) => ({
          ...tx,
          version: version
        }));
      })
    )
      .then((response) => {
        setTransactions([...response[0], ...response[1]]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedAccount, setTransactions]);

  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, [fetchTransactions, transactions.length]);

  return {
    isTransactionsLoading: loading,
    transactions,
    refetchTransactions: fetchTransactions
  };
}
