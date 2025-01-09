import React, { forwardRef, useMemo } from 'react';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheetReviewTransaction } from '@entities/harbor/components/composite';
import { useDepositHBR } from '@features/harbor/lib/hooks';
import { useStakeHBRActionsStore } from '@features/harbor/model';

const buttonNodeStyles = {
  active: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral0
  }
} as const;

export const BottomSheetReviewTransactionWithAction = forwardRef<
  BottomSheetRef,
  unknown
>((_, ref) => {
  const { amount } = useStakeHBRActionsStore();
  const { _deposit, loading, success, transaction, timestamp } =
    useDepositHBR();

  const txHash = useMemo(() => {
    if (!transaction) return 'unknown';

    return transaction.transactionHash;
  }, [transaction]);

  return (
    <BottomSheetReviewTransaction
      ref={ref}
      amount={amount}
      success={success}
      timestamp={timestamp}
      txHash={txHash}
      loading={loading}
    >
      <PrimaryButton disabled={loading} onPress={_deposit}>
        <TextOrSpinner
          loading={loading}
          loadingLabel={undefined}
          label="Stake"
          styles={buttonNodeStyles}
          spinnerColor={COLORS.brand600}
          spinnerSize="small"
        />
      </PrimaryButton>
    </BottomSheetReviewTransaction>
  );
});
