import { useBridgeHistory } from '@hooks/query/useBridgeHistory';
import { useMemo } from 'react';

export const usePendingTransactions = () => {
  const { data: transactions } = useBridgeHistory();

  const transactionInPending = useMemo(
    () => transactions.find((transaction) => !transaction.transferFinishTxHash),
    [transactions]
  );

  return { isPendingTransactions: Boolean(transactionInPending) };
};
