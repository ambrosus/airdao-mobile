import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { Spacer } from '@components/base';
import { scale } from '@utils/scaling';
import { isAndroid } from '@utils/isPlatform';
import { BottomSheetHarborPreViewProps } from '@features/harbor/components/modular/harbor-preview/model';
import { ErrorTemplate, FormTemplate, SuccessTemplate } from './components';
import { dataParseFunction } from '@features/harbor/hooks/dataParseFunction';
import { useWalletStore } from '@entities/wallet';
import {
  processStake,
  processWithdraw,
  processWithdrawReward
} from '@features/harbor/components/modular/harbor-preview/hooks';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { TransactionDTO } from '@models';

export const BottomSheetHarborPreView = forwardRef<
  BottomSheetRef,
  BottomSheetHarborPreViewProps
>(({ previewData, modalType }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);
  const { wallet } = useWalletStore();
  const { activeAmbTier } = useHarborStore();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [resultTx, setResultTx] = useState<TransactionDTO | null | undefined>(
    null
  );

  const buttonTitle = useMemo(() => {
    switch (modalType) {
      case 'stake':
        return t('staking.header');
      case 'withdraw-reward':
      case 'withdraw-stake':
        return t('harbor.withdraw.header');
      default:
        return '';
    }
  }, [modalType, t]);

  const onPreviewClose = useCallback(() => {
    if (loading) return;
    setResultTx(null);
    setIsError(false);
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef, loading]);

  const onAcceptPress = useCallback(async () => {
    try {
      setLoading(true);
      switch (modalType) {
        case 'stake': {
          const data = await processStake(
            wallet,
            'amount' in previewData ? previewData?.amount : ''
          );
          if (data?.error) {
            setIsError(true);
          } else {
            setResultTx(data?.transaction);
          }
          break;
        }
        case 'withdraw-stake': {
          const data = await processWithdraw(
            wallet,
            'withdrawAmount' in previewData ? previewData.withdrawAmount : '',
            activeAmbTier.value
          );
          if (data?.error) {
            setIsError(true);
          } else {
            setResultTx(data?.transaction);
          }
          break;
        }
        case 'withdraw-reward': {
          const data = await processWithdrawReward(wallet, activeAmbTier.value);
          if (data?.error) {
            setIsError(true);
          } else {
            setResultTx(data?.transaction);
          }
        }
      }
    } catch (e) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [activeAmbTier, modalType, previewData, wallet]);

  const content = useMemo(() => {
    switch (true) {
      case isError: {
        return (
          <ErrorTemplate
            onTryAgain={() => setIsError(false)}
            onClose={onPreviewClose}
          />
        );
      }
      case !!resultTx:
        return (
          <SuccessTemplate
            onPreviewClose={onPreviewClose}
            modalType={modalType}
            data={dataParseFunction(modalType, previewData)?.success}
            transaction={resultTx}
          />
        );
      default:
        return (
          <FormTemplate
            onAcceptPress={onAcceptPress}
            loading={loading}
            buttonTitle={buttonTitle}
            data={dataParseFunction(modalType, previewData)?.form}
          />
        );
    }
  }, [
    buttonTitle,
    isError,
    loading,
    modalType,
    onAcceptPress,
    onPreviewClose,
    previewData,
    resultTx
  ]);
  const previewTitle = useMemo(() => {
    if (isError || !!resultTx) {
      return '';
    }
    return t('common.review');
  }, [isError, resultTx, t]);

  return (
    <BottomSheet
      closeOnBackPress={!loading}
      onBackdropPress={onPreviewClose}
      title={previewTitle}
      ref={bottomSheetRef}
      swipingEnabled={false}
    >
      <View style={[styles.container, { paddingBottom: bottomInset }]}>
        {content}
      </View>
      {isAndroid && <Spacer value={scale(20)} />}
    </BottomSheet>
  );
});
