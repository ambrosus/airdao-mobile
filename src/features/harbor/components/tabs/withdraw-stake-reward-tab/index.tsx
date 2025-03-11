import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { Spacer } from '@components/base';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { InputWithoutTokenSelect } from '@components/templates';
import { COLORS } from '@constants/colors';
import { DEFAULT_WITHDRAW_PREVIEW } from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { WithdrawInfo, TiersSelector } from '@features/harbor/components/base';
import { BottomSheetHarborPreview } from '@features/harbor/components/templates';
import { processWithdraw } from '@features/harbor/lib';
import { NumberUtils, estimatedNetworkProviderFee, scale } from '@utils';
import { styles } from './styles';

export const WithdrawStakeRewardTab = () => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const {
    data: { userStaked, token, totalStaked, unStakeDelay },
    ambAmount,
    bondAmount,
    activeAmbTier
  } = useHarborStore();

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [previewData, setPreviewData] = useState(DEFAULT_WITHDRAW_PREVIEW);
  const [inputError, setInputError] = useState('');
  const [isNullInput, setIsNullInput] = useState(true);
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const isDisabledButton = useMemo(() => {
    return (
      isEstimatingGas ||
      !amountToWithdraw ||
      !totalStaked ||
      !!inputError ||
      isNullInput
    );
  }, [amountToWithdraw, inputError, isEstimatingGas, isNullInput, totalStaked]);

  const onWithdrawPress = useCallback(async () => {
    try {
      setIsEstimatingGas(true);
      const data = {
        withdrawAmount: amountToWithdraw,
        rewardAmb: ambAmount,
        rewardBond: bondAmount,
        delay: unStakeDelay.delay,
        estimatedGas: '0'
      };

      const txEstimateGas = await processWithdraw(
        wallet,
        'withdrawAmount' in previewData ? previewData.withdrawAmount : '',
        activeAmbTier.value,
        { estimateGas: true }
      );

      if (txEstimateGas instanceof ethers.BigNumber) {
        const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);

        data.estimatedGas = NumberUtils.limitDecimalCount(
          ethers.utils.formatEther(txGasFee),
          2
        );
      }

      setPreviewData(data);
      bottomSheetRef.current?.show();
    } catch (error) {
      throw error;
    } finally {
      setIsEstimatingGas(false);
    }
  }, [
    activeAmbTier.value,
    ambAmount,
    amountToWithdraw,
    bondAmount,
    previewData,
    unStakeDelay.delay,
    wallet
  ]);

  const onChangeText = (value: string) => {
    setIsNullInput(+value <= 0);
    if (value) {
      const greaterThenBalance = parseEther(value).gt(token.balance.wei);
      if (greaterThenBalance) {
        setInputError(t('bridge.insufficient.funds'));
      } else {
        setInputError('');
      }
    }

    setAmountToWithdraw(value);
  };

  return (
    <View style={styles.main}>
      <InputWithoutTokenSelect
        inputError={inputError}
        value={amountToWithdraw}
        token={token}
        onChangeText={onChangeText}
        onPressMaxAmount={() => {
          onChangeText(formatEther(userStaked));
        }}
      />
      <Spacer value={scale(8)} />
      <TiersSelector
        bondAmount={bondAmount || '0'}
        ambAmount={ambAmount || '0'}
      />
      <Spacer value={scale(8)} />
      <WithdrawInfo />
      <Spacer value={scale(16)} />
      <PrimaryButton disabled={isDisabledButton} onPress={onWithdrawPress}>
        <TextOrSpinner
          loading={isEstimatingGas}
          spinnerColor={COLORS.brand500}
          label={t(
            isNullInput ? 'button.enter.amount' : 'harbor.withdrawal.button'
          )}
          styles={{
            active: {
              fontSize: scale(14),
              fontFamily: 'Inter_500Medium',
              color: COLORS[isDisabledButton ? 'brand300' : 'neutral0']
            }
          }}
        />
      </PrimaryButton>
      <BottomSheetHarborPreview
        amountSetter={setAmountToWithdraw}
        modalType="withdraw-stake"
        previewData={previewData}
        ref={bottomSheetRef}
      />
    </View>
  );
};
