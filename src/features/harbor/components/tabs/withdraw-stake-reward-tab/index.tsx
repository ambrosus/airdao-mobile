import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { scale } from '@utils/scaling';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { InputWithoutTokenSelect } from '@components/templates';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';
import { DEFAULT_WITHDRAW_PREVIEW } from '@entities/harbor/constants';
import { BottomSheetRef } from '@components/composite';
import { useWalletStore } from '@entities/wallet';
import { styles } from './styles';
import { TiersSelector } from '../../base/tiers-selector';
import { WithdrawInfo } from '@features/harbor/components/base';
import { BottomSheetHarborPreView } from '@features/harbor/components/harbor-preview';

export const WithdrawStakeRewardTab = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();
  const {
    data: { userStaked, token, totalStaked, unStakeDelay },
    ambAmount,
    bondAmount,
    updateAll,
    loading
  } = useHarborStore();

  const { wallet } = useWalletStore();

  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [previewData, setPreviewData] = useState(DEFAULT_WITHDRAW_PREVIEW);
  const [inputError, setInputError] = useState('');

  const isDisabledButton = useMemo(() => {
    return !amountToWithdraw || !totalStaked || !!inputError;
  }, [amountToWithdraw, inputError, totalStaked]);

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

  const refetchAll = async () => {
    updateAll(wallet?.address || '');
  };

  const onChangeText = (value: string) => {
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
    <ScrollView
      refreshControl={
        <RefreshControl
          onRefresh={refetchAll}
          refreshing={loading}
          removeClippedSubviews
        />
      }
      style={styles.main}
    >
      <InputWithoutTokenSelect
        inputError={inputError}
        value={amountToWithdraw}
        token={token}
        onChangeText={onChangeText}
        onPressMaxAmount={() => {
          setAmountToWithdraw(formatEther(userStaked));
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
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS[isDisabledButton ? 'brand300' : 'neutral0']}
        >
          {t('harbor.withdrawal.button')}
        </Text>
      </PrimaryButton>
      <BottomSheetHarborPreView
        modalType="withdraw-stake"
        previewData={previewData}
        ref={bottomSheetRef}
      />
    </ScrollView>
  );
};
