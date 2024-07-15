import { useState, useEffect } from 'react';
import { TxType } from '@features/kosmos/types';
import { useBridgeContextData } from '@contexts/Bridge';
import { fetchMarketTransactions } from '@features/kosmos/api';

const VERSIONS = ['v1', 'v2'];

export function useTransactions() {
  const { selectedAccount } = useBridgeContextData();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TxType[]>([]);

  useEffect(() => {
    if (!selectedAccount?.address) return;

    setLoading(true);
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
      setLoading(false);
    });
  }, [selectedAccount]);

  return { isTransactionsLoading: loading, transactions };
}
