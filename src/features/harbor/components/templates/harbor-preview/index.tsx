import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { BottomSheetHarborPreViewProps } from '@features/harbor/components/templates/harbor-preview/models';
import { PreviewForm, PreviewSuccess } from './components';
import { harborService } from '@api/harbor/harbor-service';
import { parseEther } from 'ethers/lib/utils';
import { useWalletStore } from '@entities/wallet';
import { Transaction } from '@models';

export const BottomSheetHarborPreView = forwardRef<
  BottomSheetRef,
  BottomSheetHarborPreViewProps
>(({ previewData }, ref) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const bottomSheetRef = useForwardedRef(ref);
  const { stakeAmount } = previewData;
  const [loader, setLoader] = useState<boolean>(false);
  const [txResult, setTxResult] = useState<Transaction | null>(null);

  const onPressAccept = useCallback(async () => {
    try {
      setLoader(true);
      const result = await harborService.processStake(
        wallet?._raw,
        parseEther(stakeAmount || '0')
      );
      if (result) {
        setTxResult(result);
      }
    } finally {
      setLoader(false);
    }
  }, [stakeAmount, wallet?._raw]);

  const onPreviewClose = useCallback(
    () => bottomSheetRef?.current?.dismiss(),
    [bottomSheetRef]
  );

  const content = useMemo(() => {
    if (txResult) {
      return (
        <PreviewSuccess
          onClose={onPreviewClose}
          previewData={previewData}
          transaction={txResult}
        />
      );
    }
    return (
      <PreviewForm
        loader={loader}
        previewData={previewData}
        onAcceptPress={onPressAccept}
      />
    );
  }, [loader, onPressAccept, onPreviewClose, previewData, txResult]);

  return (
    <BottomSheet
      closeOnBackPress={!loader}
      title={(!txResult && t('common.review')) || ''}
      ref={bottomSheetRef}
      swipingEnabled={false}
    >
      <View style={[styles.container, { paddingBottom: bottomInset }]}>
        {content}
      </View>
    </BottomSheet>
  );
});
