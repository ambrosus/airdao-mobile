import { useBridgeHistory } from '../../../hooks/query/useBridgeHistory';

export const usePendingTransactions = () => {
  const { data: transactions } = useBridgeHistory();

  const transactionInPending = transactions.find(
    (transaction) => !transaction.transferFinishTxHash
  );

  return { isPendingTransactions: Boolean(transactionInPending) };
};
