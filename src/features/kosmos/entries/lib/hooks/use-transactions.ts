import { useCallback, useEffect, useState } from 'react';
import { useWalletStore } from '@entities/wallet';
import { fetchMarketTransactions } from '../../api';
import { useTransactionsStore } from '../../model';
import type { TxType } from '../../types';

const VERSIONS = ['v1', 'v2'];

export function useTransactions() {
  const { wallet } = useWalletStore();
  const [loading, setLoading] = useState(false);

  const { transactions, onChangeTransactions } = useTransactionsStore();

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
          version
        }));
      })
    )
      .then((response) => {
        onChangeTransactions([...response[0], ...response[1]]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [wallet, onChangeTransactions]);

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
