import React, { forwardRef, useMemo } from 'react';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheetReviewAMBTransaction } from '@entities/harbor/components/composite';
import { useDepositAMB } from '@features/harbor/lib/hooks';
import { useStakeHBRActionsStore } from '@features/harbor/model';

const buttonNodeStyles = {
  active: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral0
  }
} as const;

export const BottomSheetReviewAMBTransactionWithAction = forwardRef<
  BottomSheetRef,
  { apy: number }
>(({ apy }, ref) => {
  const { ambAmount } = useStakeHBRActionsStore();
  const { _depositAmb, loading, success, transaction, timestamp } =
    useDepositAMB();

  const txHash = useMemo(() => {
    if (!transaction) return 'unknown';

    return transaction.transactionHash;
  }, [transaction]);

  return (
    <BottomSheetReviewAMBTransaction
      ref={ref}
      amount={ambAmount}
      apy={apy}
      success={success}
      timestamp={timestamp}
      txHash={txHash}
      loading={loading}
    >
      <PrimaryButton disabled={loading} onPress={_depositAmb}>
        <TextOrSpinner
          loading={loading}
          loadingLabel={undefined}
          label="Stake"
          styles={buttonNodeStyles}
          spinnerColor={COLORS.brand600}
          spinnerSize="small"
        />
      </PrimaryButton>
    </BottomSheetReviewAMBTransaction>
  );
});
