import { useMemo } from 'react';
import { useBridgeHistory } from '@hooks/query/useBridgeHistory';

export const usePendingTransactions = () => {
  const { data: transactions } = useBridgeHistory();

  const transactionInPending = useMemo(
    () => transactions.find((transaction) => !transaction.transferFinishTxHash),
    [transactions]
  );

  return { isPendingTransactions: Boolean(transactionInPending) };
};
