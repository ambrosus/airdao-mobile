import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { parseEther } from 'ethers/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { BottomSheetHarborPreViewProps } from '@features/harbor/components/templates/harbor-preview/models';
import { PreviewError, PreviewForm, PreviewSuccess } from './components';
import { harborService } from '@api/harbor/harbor-service';
import { useWalletStore } from '@entities/wallet';
import { Transaction } from '@models';
import { Spacer } from '@components/base';
import { scale } from '@utils/scaling';
import { isAndroid } from '@utils/isPlatform';

export const BottomSheetHarborPreView = forwardRef<
  BottomSheetRef,
  BottomSheetHarborPreViewProps
>(({ previewData, type = 'stake' }, ref) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const bottomSheetRef = useForwardedRef(ref);
  const { amount } = previewData;

  const [loader, setLoader] = useState<boolean>(false);
  const [processError, setProcessError] = useState<unknown>(null);
  const [txResult, setTxResult] = useState<Transaction | null>(null);

  const onPressAccept = useCallback(async () => {
    try {
      setLoader(true);
      const result = await harborService.processStake(
        wallet?._raw,
        parseEther(amount || '0')
      );
      if (result) {
        if (result.error) {
          throw result.error;
        }
        setTxResult(result);
      }
    } catch (e) {
      setProcessError(e);
    } finally {
      setLoader(false);
    }
  }, [amount, wallet?._raw]);

  const onPreviewClose = useCallback(() => {
    if (loader) {
      return;
    }
    setProcessError(null);
    setTxResult(null);
    bottomSheetRef?.current?.dismiss();
  }, [bottomSheetRef, loader]);

  const content = useMemo(() => {
    switch (true) {
      case !!txResult:
        return (
          <PreviewSuccess
            onClose={onPreviewClose}
            previewData={previewData}
            transaction={txResult}
          />
        );
      case !!processError:
        return <PreviewError onClose={onPreviewClose} />;
      default:
        return (
          <PreviewForm
            loader={loader}
            previewData={previewData}
            onAcceptPress={onPressAccept}
          />
        );
    }
  }, [
    loader,
    onPressAccept,
    onPreviewClose,
    previewData,
    processError,
    txResult
  ]);

  return (
    <BottomSheet
      closeOnBackPress={false}
      onBackdropPress={onPreviewClose}
      title={(!txResult && !processError && t('common.review')) || ''}
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
