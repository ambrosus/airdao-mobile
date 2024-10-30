import React from 'react';
import { TransactionType } from '@appTypes';
import {
  TransferSentIcon,
  TransferReceivedIcon,
  ContractCallIcon,
  FailedIcon
} from '@components/svg/icons/v2/transactions';
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

export const _txStatusThumbnail = (tx: Transaction) => {
  const label = _txStatusLabel(tx);
  const { isSent } = tx;

  // Simplified logic for returning the appropriate icon
  const iconMap: Record<string, JSX.Element> = {
    [TransactionType.Transfer]: isSent ? (
      <TransferSentIcon />
    ) : (
      <TransferReceivedIcon />
    ),
    [TransactionType.ContractCall]: <ContractCallIcon />,
    default: <FailedIcon />
  };

  return iconMap[label as string] || iconMap['default'];
};
