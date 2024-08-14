import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
// @ts-ignore
import { ContractNames } from '@airdao/airdao-bond';
import { useTranslation } from 'react-i18next';
import { TxType } from '@features/kosmos/types';
import { getTimeRemaining } from '@features/kosmos/utils';
import { SecondaryButton, Toast, ToastType } from '@components/modular';
import { Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useClaimBonds } from '@features/kosmos/lib/hooks/use-claim-bonds';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

interface ClaimBondsButtonProps {
  transaction: TxType;
  isClaimingNow: boolean;
  setIsClaimingNow: Dispatch<SetStateAction<boolean>>;
  buttonStyle?: any;
  onDismissBottomSheet: () => void;
  payout: string;
}

export const ClaimBondsButton = ({
  transaction,
  isClaimingNow,
  setIsClaimingNow,
  buttonStyle,
  onDismissBottomSheet,
  payout
}: ClaimBondsButtonProps) => {
  const { t } = useTranslation();

  const { claimedOrderIds, onAppendClaimedOrderId } =
    useKosmosMarketsContextSelector();

  const { onClaimButtonPress } = useClaimBonds(transaction, setIsClaimingNow);

  const vestingEndsDate = useMemo(() => {
    return transaction.vestingType === 'Fixed-expiry'
      ? +transaction.vesting
      : +transaction.vesting + transaction.date;
  }, [transaction.date, transaction.vesting, transaction.vestingType]);

  const isVestingPass = useMemo(() => {
    return vestingEndsDate * 1000 < new Date().getTime();
  }, [vestingEndsDate]);

  const disabled = useMemo(() => {
    return isClaimingNow || !isVestingPass;
  }, [isClaimingNow, isVestingPass]);

  const isOrderClaimed = useMemo(
    () => claimedOrderIds.includes(transaction.txHash) || transaction.isClaimed,
    [claimedOrderIds, transaction]
  );

  const buttonColor = useMemo(() => {
    if (isClaimingNow || !isVestingPass || isOrderClaimed)
      return COLORS.neutral100;

    return COLORS.brand600;
  }, [isClaimingNow, isVestingPass, isOrderClaimed]);

  const textColor = useMemo(() => {
    if (!isVestingPass) return COLORS.neutral400;
    if (isOrderClaimed) return COLORS.neutral800;

    return COLORS.neutral0;
  }, [isVestingPass, isOrderClaimed]);

  const textStringValue = useMemo(() => {
    if (isOrderClaimed) return t('kosmos.button.close');
    if (!isVestingPass) return getTimeRemaining(vestingEndsDate);

    return t('kosmos.button.claim');
  }, [isOrderClaimed, isVestingPass, t, vestingEndsDate]);

  const onButtonPress = useCallback(async () => {
    if (textStringValue === t('kosmos.button.close'))
      return onDismissBottomSheet();

    try {
      const contractName =
        transaction.vestingType === 'Fixed-expiry'
          ? ContractNames.FixedExpiryTeller
          : ContractNames.FixedTermTeller;
      setIsClaimingNow(true);
      const tx = await onClaimButtonPress(contractName);

      if (tx) onAppendClaimedOrderId(transaction.txHash);
    } catch (error) {
      throw error;
    } finally {
      onDismissBottomSheet();
      setTimeout(() => {
        setIsClaimingNow(false);
        Toast.show({
          text: t('kosmos.success.toast', {
            amount: Number(payout).toFixed(4)
          }),
          type: ToastType.Success
        });
      }, 500);
    }
  }, [
    onAppendClaimedOrderId,
    onClaimButtonPress,
    onDismissBottomSheet,
    payout,
    setIsClaimingNow,
    t,
    textStringValue,
    transaction.txHash,
    transaction.vestingType
  ]);

  const combinedButtonStyle = useMemo(() => {
    return { ...buttonStyle, backgroundColor: buttonColor };
  }, [buttonColor, buttonStyle]);

  return (
    <SecondaryButton
      disabled={disabled}
      onPress={onButtonPress}
      style={combinedButtonStyle}
    >
      {isClaimingNow ? (
        <Spinner size="xs" />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter_600SemiBold',
            color: textColor
          }}
        >
          {textStringValue}
        </Text>
      )}
    </SecondaryButton>
  );
};
