import { forwardRef, useMemo } from 'react';
import { CryptoCurrencyCode } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetWithdrawTransaction } from '@entities/harbor/components/composite';
import { IAvailableWithdrawLogs } from '@entities/harbor/types';
import { useWithdrawalActions } from '@features/harbor/lib/hooks';
import { WithdrawalButton } from '../../modular';

interface BottomSheetWithdrawTransactionWithActionProps {
  amount: string;
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR;
  logs: IAvailableWithdrawLogs | null;
}

export const BottomSheetWithdrawTransactionWithAction = forwardRef<
  BottomSheetRef,
  BottomSheetWithdrawTransactionWithActionProps
>(({ amount, token, logs }, ref) => {
  const { loading, timestamp, transaction, withdrawalCallback } =
    useWithdrawalActions(token, amount);

  const txHash = useMemo(() => {
    if (!transaction) return 'unknown';

    return transaction.transactionHash;
  }, [transaction]);

  return (
    <BottomSheetWithdrawTransaction
      ref={ref}
      amount={amount}
      success={!!transaction?.transactionHash}
      timestamp={timestamp}
      txHash={txHash}
      loading={loading}
      token={token}
    >
      <WithdrawalButton
        logs={logs}
        token={token}
        loading={loading}
        onButtonPress={withdrawalCallback}
        amountToWithdraw={amount}
      />
    </BottomSheetWithdrawTransaction>
  );
});
