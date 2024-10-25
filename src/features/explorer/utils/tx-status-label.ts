import { TransactionType } from '@appTypes';
import { Transaction } from '@models';

export const _txStatusLabel = (tx: Transaction) => {
  const { type, status } = tx;

  const isTxSuccess = status === 'SUCCESS';

  const typeLabels: Record<string, string> = {
    [TransactionType.TokenTransfer]: 'Transfer',
    [TransactionType.Transfer]: 'Transfer',
    [TransactionType.ContractCall]: 'Contract call'
  };

  const statusLabel = type.includes('ContractCall')
    ? 'Contract call'
    : typeLabels[type];

  return statusLabel || (!isTxSuccess ? 'Failed Transaction' : undefined);
};
