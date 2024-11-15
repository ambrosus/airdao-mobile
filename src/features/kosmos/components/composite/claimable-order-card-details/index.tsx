import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
// @ts-ignore
import { ContractNames } from '@airdao/airdao-bond';
import { useTranslation } from 'react-i18next';
import { BigNumber, ethers } from 'ethers';
import { styles } from './styles';
import { OrderCardDetails } from '@features/kosmos/components/base';
import { SecondaryButton, Toast, ToastType } from '@components/modular';
import { TxType } from '@features/kosmos/types';
import { COLORS } from '@constants/colors';
import { getTimeRemaining } from '@features/kosmos/utils';
import { useClaimBonds } from '@features/kosmos/lib/hooks/use-claim-bonds';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { TextOrSpinner } from '@components/composite';
import { buttonWithShadowStyle } from '@constants/shadow';

interface ClaimableOrderCardDetailsProps {
  readonly transaction: TxType;
  claimingTransaction: boolean;
  setClaimingTransaction: Dispatch<SetStateAction<boolean>>;
}

export const ClaimableOrderCardDetails = ({
  transaction,
  claimingTransaction,
  setClaimingTransaction
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
    return (
      isClaimingNow || !isVestingPass || isOrderClaimed || claimingTransaction
    );
  }, [isClaimingNow, isVestingPass, isOrderClaimed, claimingTransaction]);

  const buttonColor = useMemo(() => {
    return disabled ? COLORS.neutral100 : COLORS.brand600;
  }, [disabled]);

  const textColor = useMemo(() => {
    return disabled ? COLORS.brand75 : COLORS.neutral0;
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
      setClaimingTransaction(true);
      setIsClaimingNow(true);
      const tx = await onClaimButtonPress(contractName);

      if (tx) {
        onAppendClaimedOrderId(transaction.txHash);
        sendFirebaseEvent(CustomAppEvents.kosmos_claim);
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
      setClaimingTransaction(false);
      setIsClaimingNow(false);
    }
  }, [
    transaction.vestingType,
    transaction.txHash,
    setClaimingTransaction,
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

  const buttonStyleWithDynamicColor: StyleProp<ViewStyle> = useMemo(
    () => ({ ...styles.button, backgroundColor: buttonColor }),
    [buttonColor]
  );

  return (
    <>
      <View style={styles.container}>
        <OrderCardDetails transaction={transaction} />

        <SecondaryButton
          disabled={disabled}
          style={buttonWithShadowStyle(disabled, buttonStyleWithDynamicColor)}
          onPress={onButtonPress}
        >
          <TextOrSpinner
            loading={isClaimingNow}
            label={textStringValue}
            loadingLabel={t('kosmos.button.claiming')}
            styles={{
              active: {
                fontSize: 12,
                fontFamily: 'Inter_500Medium',
                color: textColor
              },
              loading: {
                fontSize: 12,
                fontFamily: 'Inter_500Medium',
                color: COLORS.brand600
              }
            }}
          />
        </SecondaryButton>
      </View>
    </>
  );
};
