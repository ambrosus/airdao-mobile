import { formatUnits } from 'ethers/lib/utils';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';

export const parseBridgeTransaction = (
  transaction: BridgeTransactionHistoryDTO
) => {
  const getDecimals = () => {
    const tokenDecimals =
      transaction.networkFrom === 'asc'
        ? transaction.tokenTo.decimals || transaction.tokenTo.denomination
        : transaction.tokenFrom.decimals || transaction.tokenFrom.denomination;
    return tokenDecimals || 18;
  };

  const getAmount = () => {
    return transaction.amount
      ? formatUnits(transaction.amount, getDecimals())
      : transaction.denominatedAmount;
  };

  return {
    ...transaction,
    decimalAmount: getAmount()
  };
};
