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
import { KEYBOARD_OPENING_TIME } from '@constants/variables';
import { useHBRInstance, useStakeHBRStore } from '@entities/harbor';
import { StakedBalanceInfo } from '@entities/harbor/components/composite';
import { useApproveContract, useStakeHBRActionsStore } from '@features/harbor';
import { StakeInput } from '@features/harbor/components/modular';
import { BottomSheetReviewTransactionWithAction } from '@features/harbor/components/templates';
import {
  keyboardAvoidingViewOffsetWithNotchSupportedValue,
  useKeyboardContainerStyleWithSafeArea
} from '@hooks';
import { NumberUtils } from '@utils';
import { styles } from './styles';

export const StakeHBRScreen = () => {
  const { t } = useTranslation();
  const hbrInstance = useHBRInstance();
  const { approving, approve } = useApproveContract();
  const footerStyle = useKeyboardContainerStyleWithSafeArea(styles.footer);

  const { deposit, allowance, limitsConfig } = useStakeHBRStore();
  const { amount, onChangeHBRAmountToStake } = useStakeHBRActionsStore();

  const [inputError, setInputError] = useState('');

  const bottomSheetReviewTxRef = useRef<BottomSheetRef>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        onChangeHBRAmountToStake('');
      };
    }, [onChangeHBRAmountToStake])
  );

  useMemo(() => {
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
  }, [amount, hbrInstance.balance.wei, t]);

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
    Keyboard.dismiss();

    if (ethers.utils.parseEther(amount).lt(limitsConfig.minStakeValue)) {
      return setInputError(
        `Min ${NumberUtils.formatNumber(
          +ethers.utils.formatEther(limitsConfig.minStakeValue)
        )} ${CryptoCurrencyCode.HBR}`
      );
    }

    if (
      label.includes(
        t('swap.button.approve', {
          symbol: CryptoCurrencyCode.HBR
        })
      )
    ) {
      return await approve();
    }

    setTimeout(
      () => bottomSheetReviewTxRef.current?.show(),
      KEYBOARD_OPENING_TIME
    );
  }, [amount, approve, label, limitsConfig.minStakeValue, t]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Stake HBR" />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardAvoidingViewOffsetWithNotchSupportedValue(
          8
        )}
        style={styles.justifyContent}
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
              error={inputError}
              description={t('harbor.stake.description')}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={footerStyle}>
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
