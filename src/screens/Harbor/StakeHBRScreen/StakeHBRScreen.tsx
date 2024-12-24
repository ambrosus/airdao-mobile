import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { BottomSheetRef, Header, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useHBRInstance, useStakeHBRStore } from '@entities/harbor';
import { StakedBalanceInfo } from '@entities/harbor/components/composite';
import { useApproveContract, useStakeHBRActionsStore } from '@features/harbor';
import { StakeInput } from '@features/harbor/components/modular';
import { BottomSheetReviewTransactionWithAction } from '@features/harbor/components/templates';
import { NumberUtils } from '@utils';
import { styles } from './styles';

export const StakeHBRScreen = () => {
  const { t } = useTranslation();
  const hbrInstance = useHBRInstance();
  const { approving, approve } = useApproveContract();

  const { deposit, allowance } = useStakeHBRStore();
  const { amount, onChangeHBRAmountToStake } = useStakeHBRActionsStore();

  const [inputError, setInputError] = useState('');

  const bottomSheetReviewTxRef = useRef<BottomSheetRef>(null);

  const onChangeHBRAmountHandle = useCallback(
    (amount: string) => {
      if (amount) {
        const greaterThenBalance = ethers.utils
          .parseEther(amount)
          .gt(hbrInstance.balance.wei);
        if (greaterThenBalance) {
          setInputError(t('bridge.insufficient.funds'));
        } else {
          setInputError('');
        }
      }

      onChangeHBRAmountToStake(amount);
    },
    [hbrInstance.balance.wei, onChangeHBRAmountToStake, t]
  );

  const label = useMemo(() => {
    const bnAmount = ethers.utils.parseEther(!amount ? '0' : amount);

    return allowance.lt(bnAmount)
      ? t('swap.button.approve', {
          symbol: CryptoCurrencyCode.HBR
        })
      : t('button.confirm');
  }, [allowance, amount, t]);

  const disabled = useMemo(
    () => !!inputError || !amount || approving,
    [amount, approving, inputError]
  );

  const onButtonPress = useCallback(async () => {
    if (
      label.includes(
        t('swap.button.approve', {
          symbol: CryptoCurrencyCode.HBR
        })
      )
    ) {
      return await approve();
    }

    bottomSheetReviewTxRef.current?.show();
  }, [approve, label, t]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Stake HBR" />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={8}
        style={styles.justifyContent}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <StakedBalanceInfo
              title={t('harbor.staked.balance')}
              stakedValue={NumberUtils.numberToTransformedLocale(
                NumberUtils.limitDecimalCount(
                  +ethers.utils.formatEther(deposit),
                  2
                )
              )}
              coin={CryptoCurrencyCode.HBR}
            />

            <StakeInput
              description="Your AMB staking limit depends on the amount of HBR staked. Stake more
          HBR to increase your limit!"
              inputError={inputError}
              onChangeHBRAmountHandle={onChangeHBRAmountHandle}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.footer}>
          <PrimaryButton disabled={disabled} onPress={onButtonPress}>
            <TextOrSpinner
              loading={approving}
              loadingLabel={undefined}
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

      <BottomSheetReviewTransactionWithAction ref={bottomSheetReviewTxRef} />
    </SafeAreaView>
  );
};
