import { forwardRef, useMemo } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheetReviewTransaction } from '@entities/harbor/components/composite';
import { useWalletStore } from '@entities/wallet';
import { useDepositHBR } from '@features/harbor/lib/hooks';
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

interface BottomSheetReviewTransactionWithActionProps {
  estimatedGas: ethers.BigNumber;
}

export const BottomSheetReviewTransactionWithAction = forwardRef<
  BottomSheetRef,
  BottomSheetReviewTransactionWithActionProps
>(({ estimatedGas }, ref) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const ambInstance = useAMBEntity(wallet?.address ?? '');
  const { amount } = useStakeHBRActionsStore();
  const { _deposit, loading, success, transaction, timestamp } =
    useDepositHBR();

  const txHash = useMemo(() => {
    if (!transaction) return 'unknown';

    return transaction.transactionHash;
  }, [transaction]);

  const disabled = useMemo(() => {
    const parsedBalance = ethers.utils.parseEther(
      ambInstance.balance.formattedBalance
    );
    return parsedBalance.lt(estimatedGas);
  }, [ambInstance.balance.formattedBalance, estimatedGas]);

  const label = useMemo(() => {
    if (disabled) {
      return t('bridge.insufficient.funds');
    }

    return t('staking.header');
  }, [disabled, t]);

  return (
    <BottomSheetReviewTransaction
      ref={ref}
      amount={amount}
      success={success}
      timestamp={timestamp}
      txHash={txHash}
      estimatedGas={estimatedGas}
      loading={loading}
    >
      <PrimaryButton disabled={disabled} onPress={_deposit}>
        <TextOrSpinner
          loading={loading}
          loadingLabel={undefined}
          label={label}
          styles={buttonNodeStyles(disabled)}
          spinnerColor={COLORS.brand600}
          spinnerSize="small"
        />
      </PrimaryButton>
    </BottomSheetReviewTransaction>
  );
});
