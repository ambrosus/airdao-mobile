import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
// @ts-ignore
import { ContractNames } from '@airdao/airdao-bond';
import { useTranslation } from 'react-i18next';
import { BigNumber, ethers } from 'ethers';
import { styles } from './styles';
import { OrderCardDetails } from '@features/kosmos/components/base';
import { SecondaryButton, Toast, ToastType } from '@components/modular';
import { Spinner, Text } from '@components/base';
import { TxType } from '@features/kosmos/types';
import { COLORS } from '@constants/colors';
import { getTimeRemaining } from '@features/kosmos/utils';
import { useClaimBonds } from '@features/kosmos/lib/hooks/use-claim-bonds';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

interface ClaimableOrderCardDetailsProps {
  readonly transaction: TxType;
}

export const ClaimableOrderCardDetails = ({
  transaction
}: ClaimableOrderCardDetailsProps) => {
  const { t } = useTranslation();

  const { claimedOrderIds, onAppendClaimedOrderId } =
    useKosmosMarketsContextSelector();

  const [isClaimingNow, setIsClaimingNow] = useState(false);
  const { onClaimButtonPress } = useClaimBonds(transaction, setIsClaimingNow);

  const { extractTokenCb } = useExtractToken();

  const vestingEndsDate = useMemo(() => {
    return transaction.vestingType === 'Fixed-expiry'
      ? +transaction.vesting
      : +transaction.vesting + transaction.date;
  }, [transaction.date, transaction.vesting, transaction.vestingType]);

  const isVestingPass = useMemo(() => {
    return vestingEndsDate * 1000 < new Date().getTime();
  }, [vestingEndsDate]);

  const isOrderClaimed = useMemo(
    () => claimedOrderIds.includes(transaction.txHash) || transaction.isClaimed,
    [claimedOrderIds, transaction]
  );

  const disabled = useMemo(() => {
    return isClaimingNow || !isVestingPass || isOrderClaimed;
  }, [isClaimingNow, isVestingPass, isOrderClaimed]);

  const buttonColor = useMemo(() => {
    return disabled ? COLORS.neutral100 : COLORS.brand600;
  }, [disabled]);

  const textColor = useMemo(() => {
    return disabled ? COLORS.neutral400 : COLORS.neutral0;
  }, [disabled]);

  const payout = useMemo(() => {
    const token = extractTokenCb(transaction.payoutToken);

    const payoutBn = BigNumber.from(transaction.payoutAmount);
    const payout = ethers.utils.formatUnits(payoutBn, token?.decimals);

    return +payout * (token?.price || 0);
  }, [extractTokenCb, transaction.payoutAmount, transaction.payoutToken]);

  const onButtonPress = useCallback(async () => {
    try {
      const contractName =
        transaction.vestingType === 'Fixed-expiry'
          ? ContractNames.FixedExpiryTeller
          : ContractNames.FixedTermTeller;
      setIsClaimingNow(true);
      const tx = await onClaimButtonPress(contractName);

      if (tx) {
        onAppendClaimedOrderId(transaction.txHash);
        Toast.show({
          text: t('kosmos.success.toast', {
            amount: Number(payout).toFixed(4)
          }),
          type: ToastType.Success
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsClaimingNow(false);
    }
  }, [
    transaction.vestingType,
    transaction.txHash,
    onClaimButtonPress,
    onAppendClaimedOrderId,
    t,
    payout
  ]);

  const textStringValue = useMemo(() => {
    if (isOrderClaimed) return t('kosmos.button.claimed');
    if (!isVestingPass) return getTimeRemaining(vestingEndsDate);

    return t('kosmos.button.claim');
  }, [isOrderClaimed, t, isVestingPass, vestingEndsDate]);

  return (
    <>
      <View style={styles.container}>
        <OrderCardDetails transaction={transaction} />

        <SecondaryButton
          disabled={disabled}
          style={{ ...styles.button, backgroundColor: buttonColor }}
          onPress={onButtonPress}
        >
          {isClaimingNow ? (
            <Spinner size="xs" />
          ) : (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_500Medium',
                color: textColor
              }}
            >
              {textStringValue}
            </Text>
          )}
        </SecondaryButton>
      </View>
    </>
  );
};
