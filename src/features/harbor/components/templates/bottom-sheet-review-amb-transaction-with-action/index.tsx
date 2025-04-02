import { forwardRef, useMemo } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheetReviewAMBTransaction } from '@entities/harbor/components/composite';
import { useWalletStore } from '@entities/wallet';
import { useDepositAMB } from '@features/harbor/lib/hooks';
import { useStakeHBRActionsStore } from '@features/harbor/model';
import { useAMBEntity } from '@features/send-funds/lib/hooks';

const buttonNodeStyles = (disabled: boolean) =>
  ({
    active: {
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
      color: disabled ? COLORS.neutral500 : COLORS.neutral0
    }
  } as const);

interface BottomSheetReviewAMBTransactionWithActionProps {
  apy: number;
  estimatedGas: ethers.BigNumber;
}

export const BottomSheetReviewAMBTransactionWithAction = forwardRef<
  BottomSheetRef,
  BottomSheetReviewAMBTransactionWithActionProps
>(({ apy, estimatedGas }, ref) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const ambInstance = useAMBEntity(wallet?.address ?? '');
  const { ambAmount } = useStakeHBRActionsStore();
  const { _depositAmb, loading, success, transaction, timestamp } =
    useDepositAMB();

  const txHash = useMemo(() => {
    if (!transaction) return 'unknown';

    return transaction.transactionHash;
  }, [transaction]);

  const disabled = useMemo(() => {
    const parsedBalance = ethers.utils.parseEther(
      ambInstance.balance.formattedBalance
    );
    const parsedAmountToStake = ethers.utils.parseEther(
      !!ambAmount ? ambAmount : '0'
    );

    return parsedBalance.lt(parsedAmountToStake.add(estimatedGas)) || loading;
  }, [ambAmount, ambInstance.balance.formattedBalance, estimatedGas, loading]);

  const label = useMemo(() => {
    if (disabled) {
      return t('bridge.insufficient.funds');
    }

    return t('staking.header');
  }, [disabled, t]);

  return (
    <BottomSheetReviewAMBTransaction
      ref={ref}
      amount={ambAmount}
      estimatedGas={estimatedGas}
      apy={apy}
      success={success}
      timestamp={timestamp}
      txHash={txHash}
      loading={loading}
    >
      <PrimaryButton disabled={disabled} onPress={_depositAmb}>
        <TextOrSpinner
          loading={loading}
          loadingLabel={undefined}
          label={label}
          styles={buttonNodeStyles(disabled)}
          spinnerColor={COLORS.brand600}
          spinnerSize="small"
        />
      </PrimaryButton>
    </BottomSheetReviewAMBTransaction>
  );
});
