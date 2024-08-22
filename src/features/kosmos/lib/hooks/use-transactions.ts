import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@hooks';
import { TxType } from '@features/kosmos/types';
import { fetchMarketTransactions } from '@features/kosmos/api';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

const VERSIONS = ['v1', 'v2'];

export function useTransactions() {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const { transactions, setTransactions } = useKosmosMarketsContextSelector();

  const fetchTransactions = useCallback(() => {
    if (!wallet?.address) return;

    const controller = new AbortController();

    setLoading(true);
    Promise.all(
      VERSIONS.map(async (version) => {
        const response = await fetchMarketTransactions(
          version,
          wallet.address,
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
  }, [wallet, setTransactions]);

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
