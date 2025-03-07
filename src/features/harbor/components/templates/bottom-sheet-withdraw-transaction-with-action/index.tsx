import { forwardRef, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
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
  estimatedGas: ethers.BigNumber;
  ambBalance: ethers.BigNumber;
}

export const BottomSheetWithdrawTransactionWithAction = forwardRef<
  BottomSheetRef,
  BottomSheetWithdrawTransactionWithActionProps
>(({ amount, token, logs, estimatedGas, ambBalance }, ref) => {
  const { loading, timestamp, transaction, withdrawalCallback } =
    useWithdrawalActions(token, amount);

  const txHash = useMemo(() => {
    if (!transaction) return 'unknown';

    return transaction.transactionHash;
  }, [transaction]);

  const onWithdrawalCallback = useCallback(
    async () => withdrawalCallback({ estimateGas: false }),
    [withdrawalCallback]
  );

  return (
    <BottomSheetWithdrawTransaction
      ref={ref}
      amount={amount}
      estimatedGas={estimatedGas}
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
        onButtonPress={onWithdrawalCallback}
        amountToWithdraw={amount}
        estimatedGas={estimatedGas}
        ambBalance={ambBalance}
      />
    </BottomSheetWithdrawTransaction>
  );
});
