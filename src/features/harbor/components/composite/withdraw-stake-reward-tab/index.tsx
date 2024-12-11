import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { scale } from '@utils/scaling';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { InputWithoutTokenSelect } from '@components/templates';
import { formatEther } from 'ethers/lib/utils';
import { TiersSelector, WithdrawInfo } from './components';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';
import { BottomSheetHarborPreView } from '@features/harbor/components/templates';
import { DEFAULT_PREVIEW } from '@entities/harbor/constants';
import { BottomSheetRef } from '@components/composite';

export const WithdrawStakeRewardTab = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();
  const {
    data: { userStaked, token, totalStaked }
  } = useHarborStore();

  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [previewData, setPreviewData] = useState(DEFAULT_PREVIEW);
  const [bondAmount, setBondAmount] = useState('123.1');
  const [ambAmount, setAmbAmount] = useState('456.3');

  const isDisabledButton = useMemo(() => {
    return !amountToWithdraw || !totalStaked;
  }, [amountToWithdraw, totalStaked]);

  const onWithdrawPress = useCallback(() => {
    setPreviewData(DEFAULT_PREVIEW)
    setBondAmount('111')
    setAmbAmount('1111')
    // do nothing
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: scale(16)
      }}
    >
      <InputWithoutTokenSelect
        value={amountToWithdraw}
        token={token}
        onChangeText={setAmountToWithdraw}
        onPressMaxAmount={() => {
          setAmountToWithdraw(formatEther(userStaked));
        }}
      />
      <Spacer value={scale(8)} />
      <TiersSelector bondAmount={bondAmount} ambAmount={ambAmount} />
      <Spacer value={scale(8)} />
      <WithdrawInfo />
      <Spacer value={scale(16)} />
      <PrimaryButton disabled={isDisabledButton} onPress={onWithdrawPress}>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS[isDisabledButton ? 'brand300' : 'neutral0']}
        >
          {t('harbor.withdrawal.button')}
        </Text>
      </PrimaryButton>
      <BottomSheetHarborPreView
        previewData={previewData}
        ref={bottomSheetRef}
      />
    </View>
  );
};
