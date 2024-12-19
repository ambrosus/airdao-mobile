import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacer } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { EMPTY_HARBOR_PROCESS_TRANSACTION } from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import {
  ErrorTemplate,
  FormTemplate,
  SuccessTemplate
} from '@features/harbor/components/base';
import {
  BottomSheetHarborPreViewProps,
  EmptyHarborProcessTransaction
} from '@features/harbor/components/harbor-preview/model';
import { dataParseFunction, processFunctions } from '@features/harbor/hooks';
import { useForwardedRef } from '@hooks';
import { TransactionDTO } from '@models';
import { isAndroid, scale } from '@utils';
import { styles } from './styles';

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
    bottomSheetRef.current?.dismiss();
    if (isError || !!resultTx) updateAll(wallet?.address || '');
    setResultTx(null);
    setIsError(false);
  }, [bottomSheetRef, isError, loading, resultTx, updateAll, wallet?.address]);

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
      case isError:
        return (
          <ErrorTemplate
            onTryAgain={() => setIsError(false)}
            onClose={onPreviewClose}
          />
        );
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
