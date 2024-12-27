import React, { forwardRef } from 'react';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheetReviewAMBTransaction } from '@entities/harbor/components/composite';
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

  const _deposit = () => console.warn('asdf');

  return (
    <BottomSheetReviewAMBTransaction
      ref={ref}
      amount={ambAmount}
      apy={apy}
      success={false}
      timestamp={123}
      txHash=""
      loading={false}
    >
      <PrimaryButton onPress={_deposit}>
        <TextOrSpinner
          loading={false}
          loadingLabel={undefined}
          label="Stake"
          styles={buttonNodeStyles}
          spinnerColor={buttonNodeStyles.active.color}
          spinnerSize="small"
        />
      </PrimaryButton>
    </BottomSheetReviewAMBTransaction>
  );
});
