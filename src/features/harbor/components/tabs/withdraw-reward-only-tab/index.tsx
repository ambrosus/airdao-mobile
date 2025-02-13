import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { Spacer } from '@components/base';
import { BottomSheetRef, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { DEFAULT_WITHDRAW_PREVIEW } from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet/model/wallet-store';
import { BottomSheetHarborPreview } from '@features/harbor/components/templates';
import { processWithdrawReward } from '@features/harbor/hooks/processHelpers/processWithdrawReward';
import { NumberUtils, estimatedNetworkProviderFee, scale } from '@utils';
import { styles } from './styles';
import { TiersSelector } from '../../base/tiers-selector';

export const WithdrawRewardOnlyTab = () => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [isNullAmount, setIsNullAmount] = useState(false);
  const {
    ambAmount,
    bondAmount,
    activeAmbTier,
    data: { unStakeDelay }
  } = useHarborStore();

  const [previewData, setPreviewData] = useState(DEFAULT_WITHDRAW_PREVIEW);
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);

  const onPressRewardWithdraw = useCallback(async () => {
    try {
      setIsEstimatingGas(true);
      const data = {
        withdrawAmount: '0',
        delay: unStakeDelay.delay,
        rewardAmb: ambAmount,
        rewardBond: bondAmount,
        estimatedGas: '0'
      };

      const txEstimateGas = await processWithdrawReward(
        wallet,
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
  }, [activeAmbTier.value, ambAmount, bondAmount, unStakeDelay.delay, wallet]);

  useEffect(() => {
    if (+ambAmount <= 0 && +bondAmount <= 0) {
      setIsNullAmount(true);
    } else {
      setIsNullAmount(false);
    }
  }, [ambAmount, bondAmount]);

  const disabled = useMemo(() => {
    return isNullAmount || isEstimatingGas;
  }, [isNullAmount, isEstimatingGas]);

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
        disabled={disabled}
      >
        <TextOrSpinner
          loading={isEstimatingGas}
          spinnerColor={COLORS.brand500}
          label={t('harbor.withdrawal.button')}
          styles={{
            active: {
              fontSize: scale(14),
              fontFamily: 'Inter_500Medium',
              color: COLORS[disabled ? 'brand300' : 'neutral0']
            }
          }}
        />
      </PrimaryButton>
      <BottomSheetHarborPreview
        modalType="withdraw-reward"
        previewData={previewData}
        ref={bottomSheetRef}
      />
    </View>
  );
};
