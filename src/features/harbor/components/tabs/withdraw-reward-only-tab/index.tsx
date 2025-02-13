import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { DEFAULT_WITHDRAW_PREVIEW } from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { BottomSheetHarborPreview } from '@features/harbor/components/templates';
import { scale } from '@utils';
import { styles } from './styles';
import { TiersSelector } from '../../base/tiers-selector';

export const WithdrawRewardOnlyTab = () => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [isNullAmount, setIsNullAmount] = useState(false);
  const {
    ambAmount,
    bondAmount,
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
  useEffect(() => {
    if (+ambAmount <= 0 && +bondAmount <= 0) {
      setIsNullAmount(true);
    } else {
      setIsNullAmount(false);
    }
  }, [ambAmount, bondAmount]);

  return (
    <View style={styles.main}>
      <TiersSelector
        bondAmount={bondAmount || '0'}
        ambAmount={ambAmount || '0'}
      />
      <Spacer value={scale(8)} />

      <PrimaryButton
        style={styles.button}
        onPress={onPressRewardWithdraw}
        disabled={isNullAmount}
      >
        <Text color={COLORS[isNullAmount ? 'brand300' : 'neutral0']}>
          {t('harbor.withdrawal.button')}
        </Text>
      </PrimaryButton>
      <BottomSheetHarborPreview
        modalType="withdraw-reward"
        previewData={previewData}
        ref={bottomSheetRef}
      />
    </View>
  );
};
