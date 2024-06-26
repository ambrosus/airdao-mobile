import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { formatUnits } from 'ethers/lib/utils';

export const parseBridgeTransaction = (
  transaction: BridgeTransactionHistoryDTO
) => {
  const getDecimals = () => {
    const tokenDecimals =
      transaction.networkFrom === 'amb'
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
