import { useCallback, useMemo, useRef } from 'react';
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
import {
  useHBRInstance,
  useInputErrorStakeHBR,
  useStakeHBRStore
} from '@entities/harbor';
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
  const error = useInputErrorStakeHBR(hbrInstance);

  const { deposit, allowance } = useStakeHBRStore();
  const { amount, onChangeHBRAmountToStake } = useStakeHBRActionsStore();

  const bottomSheetReviewTxRef = useRef<BottomSheetRef>(null);

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

    if (!!error) return error;

    if (allowance.lt(bnAmount)) {
      return t('swap.button.approve', {
        symbol: CryptoCurrencyCode.HBR
      });
    }

    return t('button.confirm');
  }, [allowance, amount, error, t]);

  const disabled = useMemo(
    () => !!error || !amount || approving,
    [amount, approving, error]
  );

  const onButtonPress = useCallback(async () => {
    Keyboard.dismiss();

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
  }, [approve, label, t]);

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
