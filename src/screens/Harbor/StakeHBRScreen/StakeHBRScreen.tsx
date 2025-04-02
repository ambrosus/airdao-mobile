import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CryptoCurrencyCode } from '@appTypes';
import { BottomSheetRef, Header, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { KEYBOARD_OPENING_TIME, bnZERO } from '@constants/variables';
import {
  useHBRInstance,
  useInputErrorStakeHBR,
  useStakeHBRStore
} from '@entities/harbor';
import { StakedBalanceInfo } from '@entities/harbor/components/composite';

import { useWalletStore } from '@entities/wallet';
import {
  useApproveContract,
  useDepositHBR,
  useStakeHBRActionsStore
} from '@features/harbor';
import { StakeInput } from '@features/harbor/components/modular';
import { BottomSheetReviewTransactionWithAction } from '@features/harbor/components/templates';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import {
  keyboardAvoidingViewOffsetWithNotchSupportedValue,
  useDebounce,
  useKeyboardContainerStyleWithSafeArea
} from '@hooks';
import { estimatedNetworkProviderFee, NumberUtils } from '@utils';
import { styles } from './styles';

export const StakeHBRScreen = () => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const hbrInstance = useHBRInstance();
  const { approving, approve } = useApproveContract();
  const footerStyle = useKeyboardContainerStyleWithSafeArea(styles.footer);
  const error = useInputErrorStakeHBR(hbrInstance);

  const ambInstance = useAMBEntity(wallet?.address ?? '');

  const { deposit, allowance } = useStakeHBRStore();
  const { amount, onChangeHBRAmountToStake } = useStakeHBRActionsStore();
  const { estimateTransactionGas } = useDepositHBR();

  const bottomSheetReviewTxRef = useRef<BottomSheetRef>(null);

  const [estimatedGas, setEstimatedGas] = useState(bnZERO);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEstimateFeeEffect = useCallback(async () => {
    if (+amount >= 1000) {
      setLoading(true);
      setIsInsufficientBalance(false);
      const bnAmount = ethers.utils.parseEther(amount);
      const parsedAmbBalance = ethers.utils.parseEther(
        ambInstance.balance.formattedBalance
      );

      if (allowance.lt(bnAmount)) {
        const approveEstimatedGas = await approve({ estimateGas: true });
        if (approveEstimatedGas instanceof ethers.BigNumber) {
          const txGasFee = await estimatedNetworkProviderFee(
            approveEstimatedGas
          );
          setEstimatedGas(txGasFee);

          if (parsedAmbBalance.lt(txGasFee)) {
            setIsInsufficientBalance(true);
          }
        }
      }
      setLoading(false);
    }
  }, [allowance, ambInstance.balance.formattedBalance, amount, approve]);

  // Effect to check estimated gas fee from input
  useDebounce(handleEstimateFeeEffect, 0);

  useFocusEffect(
    useCallback(() => {
      return () => {
        onChangeHBRAmountToStake('');
      };
    }, [onChangeHBRAmountToStake])
  );

  const label = useMemo(() => {
    if (!amount) {
      return t('button.confirm');
    }

    const bnAmount = ethers.utils.parseEther(amount);

    if (isInsufficientBalance) return t('bridge.insufficient.funds');

    if (!!error) return error;

    if (allowance.lt(bnAmount)) {
      return t('swap.button.approve', {
        symbol: CryptoCurrencyCode.HBR
      });
    }

    return t('button.confirm');
  }, [allowance, amount, error, isInsufficientBalance, t]);

  const disabled = useMemo(
    () => !!error || !amount || approving || loading || isInsufficientBalance,
    [amount, approving, error, isInsufficientBalance, loading]
  );

  const onButtonPress = useCallback(async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      if (allowance.lt(ethers.utils.parseEther(amount))) {
        const txEstimateGas = await approve({ estimateGas: true });

        if (txEstimateGas instanceof ethers.BigNumber) {
          const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);
          setEstimatedGas(txGasFee);
        }
      } else {
        const txEstimateGas = await estimateTransactionGas();
        const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);
        setEstimatedGas(txGasFee);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }

    setTimeout(
      () => bottomSheetReviewTxRef.current?.show(),
      KEYBOARD_OPENING_TIME
    );
  }, [allowance, amount, approve, estimateTransactionGas]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Stake HBR" />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.justifyContent}
        keyboardVerticalOffset={keyboardAvoidingViewOffsetWithNotchSupportedValue(
          8
        )}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <StakedBalanceInfo
              title={t('harbor.staked.balance')}
              coin={CryptoCurrencyCode.HBR}
              stakedValue={NumberUtils.numberToTransformedLocale(
                NumberUtils.limitDecimalCount(
                  +ethers.utils.formatEther(deposit),
                  2
                )
              )}
            />

            <StakeInput
              error={undefined}
              description={t('harbor.stake.description')}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={footerStyle}>
          <PrimaryButton disabled={disabled} onPress={onButtonPress}>
            <TextOrSpinner
              loading={approving || loading}
              label={label}
              styles={{
                active: {
                  fontSize: 14,
                  fontFamily: 'Inter_500Medium',
                  color: disabled ? COLORS.neutral500 : COLORS.neutral0
                }
              }}
            />
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>

      <BottomSheetReviewTransactionWithAction
        ref={bottomSheetReviewTxRef}
        estimatedGas={estimatedGas}
      />
    </SafeAreaView>
  );
};
