import { forwardRef, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { KEYBOARD_OPENING_TIME } from '@constants/variables';
import { useStakeHBRStore } from '@entities/harbor';
import { BottomSheetReviewTransaction } from '@entities/harbor/components/composite';
import { useWalletStore } from '@entities/wallet';
import { useApproveContract, useDepositHBR } from '@features/harbor/lib/hooks';
import { useStakeHBRActionsStore } from '@features/harbor/model';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import { useForwardedRef } from '@hooks';

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
  const { allowance } = useStakeHBRStore();
  const { approve, approving } = useApproveContract();
  const { _deposit, loading, success, transaction, timestamp } =
    useDepositHBR();

  const bottomSheetReviewTxRef = useForwardedRef<BottomSheetRef>(ref);

  const txHash = useMemo(() => {
    if (!transaction) return 'unknown';

    return transaction.transactionHash;
  }, [transaction]);

  const isApprovalRequired = useMemo(() => {
    if (!amount) return false;

    return allowance.lt(ethers.utils.parseEther(amount));
  }, [allowance, amount]);

  const disabled = useMemo(() => {
    const parsedBalance = ethers.utils.parseEther(
      ambInstance.balance.formattedBalance
    );

    return parsedBalance.lt(estimatedGas) || loading || approving;
  }, [ambInstance.balance.formattedBalance, estimatedGas, loading, approving]);

  const label = useMemo(() => {
    if (disabled) {
      return t('bridge.insufficient.funds');
    }

    if (isApprovalRequired) {
      return t('swap.button.approve', {
        symbol: CryptoCurrencyCode.HBR
      });
    }

    return t('staking.header');
  }, [disabled, isApprovalRequired, t]);

  const onButtonPress = useCallback(async () => {
    if (isApprovalRequired) {
      await approve();

      setTimeout(
        () => bottomSheetReviewTxRef.current?.dismiss(),
        KEYBOARD_OPENING_TIME
      );
    } else {
      await _deposit();
    }
  }, [isApprovalRequired, approve, _deposit, bottomSheetReviewTxRef]);

  return (
    <BottomSheetReviewTransaction
      ref={bottomSheetReviewTxRef}
      amount={amount}
      success={success}
      timestamp={timestamp}
      txHash={txHash}
      estimatedGas={estimatedGas}
      loading={loading || approving}
      isApprovalRequired={isApprovalRequired}
      approving={approving}
    >
      <PrimaryButton disabled={disabled} onPress={onButtonPress}>
        <TextOrSpinner
          loading={loading || approving}
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
