import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { TiersSelector } from '@features/harbor/components/templates/tiers-selector';
import { scale } from '@utils/scaling';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';
import { BottomSheetHarborWithdrawPreView } from '@features/harbor/components/modular/harbor-withdraw-preview';
import { BottomSheetRef } from '@components/composite';
import { DEFAULT_WITHDRAW_PREVIEW } from '@entities/harbor/constants';

export const WithdrawRewardOnlyTab = () => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const {
    ambAmount,
    bondAmount,
    data: { unStakeDelay }
  } = useHarborStore();
  const [previewData, setPreviewData] = useState(DEFAULT_WITHDRAW_PREVIEW);

  const onPressRewardWithdraw = useCallback(async () => {
    const _previewData = {
      amount: '0',
      delay: +unStakeDelay,
      rewardAmb: ambAmount,
      rewardBond: bondAmount
    };
    setPreviewData(_previewData);
    bottomSheetRef.current?.show();
  }, [ambAmount, bondAmount, unStakeDelay]);
  return (
    <View style={{ paddingHorizontal: scale(16) }}>
      <TiersSelector
        bondAmount={ambAmount || '0'}
        ambAmount={bondAmount || '0'}
      />
      <Spacer value={scale(8)} />
      <PrimaryButton onPress={onPressRewardWithdraw}>
        <Text color={COLORS.neutral0}>{t('harbor.withdrawal.button')}</Text>
      </PrimaryButton>
      <BottomSheetHarborWithdrawPreView
        ref={bottomSheetRef}
        previewData={previewData}
      />
    </View>
  );
};
