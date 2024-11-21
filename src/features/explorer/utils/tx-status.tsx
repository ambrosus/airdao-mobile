import React from 'react';
import { TransactionType } from '@appTypes';
import {
  TransferSentIcon,
  TransferReceivedIcon,
  ContractCallIcon,
  FailedIcon
} from '@components/svg/icons/v2/transactions';
import { Transaction } from '@models';
import { COLORS } from '@constants/colors';

export const _txStatusLabel = (tx: Transaction) => {
  const { type, status } = tx;

  const isTxSuccess = status === 'SUCCESS';

  const typeLabels: Record<string, string> = {
    [TransactionType.TokenTransfer]: 'Transfer',
    [TransactionType.Transfer]: 'Transfer',
    [TransactionType.ContractCall]: 'Contract call',
    [TransactionType.BlockReward]: 'Block reward'
  };

  const statusLabel = type.includes('ValidatorSet')
    ? 'Validator Set'
    : type.includes('ContractCall')
    ? 'Contract call'
    : typeLabels[type];

  return statusLabel || (!isTxSuccess ? 'Failed Transaction' : ' ');
};

export const _txStatusThumbnail = (tx: Transaction) => {
  const label = _txStatusLabel(tx);
  const { isSent } = tx;

  // Simplified logic for returning the appropriate icon
  const iconMap: Record<string, JSX.Element> = {
    'Transfer': isSent ? <TransferSentIcon /> : <TransferReceivedIcon />,
    'Contract call': <ContractCallIcon />,
    'Validator Set': <TransferSentIcon />,
    'default': <FailedIcon color={COLORS.error400} />
  };

  return iconMap[label as string] || iconMap.default;
};
