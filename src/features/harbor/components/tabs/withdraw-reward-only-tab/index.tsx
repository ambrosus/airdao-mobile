import React, { useCallback, useRef, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { TiersSelector } from '../../base/tiers-selector';
import { scale } from '@utils/scaling';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';
import { BottomSheetRef } from '@components/composite';
import { DEFAULT_WITHDRAW_PREVIEW } from '@entities/harbor/constants';
import { useWalletStore } from '@entities/wallet';
import { styles } from './styles';
import { BottomSheetHarborPreView } from '@features/harbor/components/harbor-preview';

export const WithdrawRewardOnlyTab = () => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { wallet } = useWalletStore();
  const {
    ambAmount,
    bondAmount,
    updateAll,
    loading,
    data: { unStakeDelay }
  } = useHarborStore();

  const [previewData, setPreviewData] = useState(DEFAULT_WITHDRAW_PREVIEW);

  const onPressRewardWithdraw = useCallback(async () => {
    const _previewData = {
      withdrawAmount: '0',
      delay: unStakeDelay.delay,
      rewardAmb: ambAmount,
      rewardBond: bondAmount
    };
    setPreviewData(_previewData);
    bottomSheetRef.current?.show();
  }, [ambAmount, bondAmount, unStakeDelay]);

  const refetchAll = async () => {
    updateAll(wallet?.address || '');
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          onRefresh={refetchAll}
          refreshing={loading}
          removeClippedSubviews
        />
      }
      contentContainerStyle={styles.container}
      style={styles.main}
    >
      <TiersSelector
        bondAmount={bondAmount || '0'}
        ambAmount={ambAmount || '0'}
      />
      <Spacer value={scale(8)} />
      <PrimaryButton onPress={onPressRewardWithdraw}>
        <Text color={COLORS.neutral0}>{t('harbor.withdrawal.button')}</Text>
      </PrimaryButton>
      <BottomSheetHarborPreView
        modalType="withdraw-reward"
        previewData={previewData}
        ref={bottomSheetRef}
      />
    </ScrollView>
  );
};
