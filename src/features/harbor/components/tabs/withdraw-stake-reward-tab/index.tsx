import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { InputWithoutTokenSelect } from '@components/templates';
import { COLORS } from '@constants/colors';
import { DEFAULT_WITHDRAW_PREVIEW } from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { WithdrawInfo } from '@features/harbor/components/base';
import { BottomSheetHarborPreview } from '@features/harbor/components/templates';
import { scale } from '@utils';
import { styles } from './styles';
import { TiersSelector } from '../../base/tiers-selector';

export const WithdrawStakeRewardTab = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();
  const {
    data: { userStaked, token, totalStaked, unStakeDelay },
    ambAmount,
    bondAmount
  } = useHarborStore();

  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [previewData, setPreviewData] = useState(DEFAULT_WITHDRAW_PREVIEW);
  const [inputError, setInputError] = useState('');
  const [isNullInput, setIsNullInput] = useState(true);

  const isDisabledButton = useMemo(() => {
    return !amountToWithdraw || !totalStaked || !!inputError || isNullInput;
  }, [amountToWithdraw, inputError, isNullInput, totalStaked]);

  const onWithdrawPress = useCallback(() => {
    const _previewData = {
      withdrawAmount: amountToWithdraw,
      rewardAmb: ambAmount,
      rewardBond: bondAmount,
      delay: unStakeDelay.delay
    };
    setPreviewData(_previewData);
    bottomSheetRef.current?.show();
  }, [ambAmount, amountToWithdraw, bondAmount, unStakeDelay.delay]);

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
        <Text
          fontSize={scale(14)}
          fontFamily="Inter_500Medium"
          color={COLORS[isDisabledButton ? 'brand300' : 'neutral0']}
        >
          {t(isNullInput ? 'button.enter.amount' : 'harbor.withdrawal.button')}
        </Text>
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
