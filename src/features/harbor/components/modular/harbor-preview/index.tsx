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
import {
  BottomSheetHarborPreViewProps,
  EmptyHarborProcessTransaction
} from '@features/harbor/components/modular/harbor-preview/model';
import { ErrorTemplate, FormTemplate, SuccessTemplate } from './components';
import { dataParseFunction } from '@features/harbor/hooks/dataParseFunction';
import { useWalletStore } from '@entities/wallet';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { TransactionDTO } from '@models';
import { processFunctions } from './hooks/processFunction';
import { EMPTY_HARBOR_PROCESS_TRANSACTION } from '@entities/harbor/constants';

export const BottomSheetHarborPreView = forwardRef<
  BottomSheetRef,
  BottomSheetHarborPreViewProps
>(({ previewData, modalType }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);
  const { wallet } = useWalletStore();
  const { activeAmbTier, updateAll } = useHarborStore();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [resultTx, setResultTx] = useState<
    TransactionDTO | null | EmptyHarborProcessTransaction
  >(null);

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
      const data = await processFunctions(
        modalType,
        wallet,
        previewData,
        activeAmbTier
      );
      if (data?.error) {
        setIsError(true);
      } else {
        if (data?.transaction) {
          setResultTx(data?.transaction);
        }
        if (data?.processStatus === 'done') {
          setResultTx(EMPTY_HARBOR_PROCESS_TRANSACTION);
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
        updateAll(wallet?.address || '');
        return (
          <ErrorTemplate
            onTryAgain={() => setIsError(false)}
            onClose={onPreviewClose}
          />
        );
      }
      case !!resultTx: {
        updateAll(wallet?.address || '');
        return (
          <SuccessTemplate
            onPreviewClose={onPreviewClose}
            modalType={modalType}
            data={dataParseFunction(modalType, previewData)?.success}
            transaction={resultTx}
          />
        );
      }
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
    resultTx,
    updateAll,
    wallet?.address
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
