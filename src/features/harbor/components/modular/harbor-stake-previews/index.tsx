import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { parseEther } from 'ethers/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { BottomSheetHarborStakePreViewProps } from './models';
import { harborService } from '@api/harbor/harbor-service';
import { useWalletStore } from '@entities/wallet';
import { Transaction } from '@models';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { isAndroid } from '@utils/isPlatform';
import { PreviewForm } from '@features/harbor/components/modular/preview-form';
import { PreviewSuccess } from '@features/harbor/components/modular/preview-success';
import { PreviewError } from '@features/harbor/components/modular/preview-error';
import { useParsePreviewData } from '@features/harbor/components/modular/harbor-stake-previews/hooks/parsePreviewData';
import { NumberUtils } from '@utils/number';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';

export const BottomSheetHarborStakePreView = forwardRef<
  BottomSheetRef,
  BottomSheetHarborStakePreViewProps
>(({ previewData }, ref) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const { updateAll } = useHarborStore();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const bottomSheetRef = useForwardedRef(ref);

  const [loader, setLoader] = useState<boolean>(false);
  const [processError, setProcessError] = useState<unknown>(null);
  const [txResult, setTxResult] = useState<Transaction | null>(null);

  const onPressAccept = useCallback(async () => {
    try {
      setLoader(true);
      const result = await harborService.processStake(
        wallet?._raw,
        parseEther(previewData.amount || '0')
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
  }, [previewData.amount, wallet?._raw]);

  const onPreviewClose = useCallback(() => {
    if (loader) {
      return;
    }
    setProcessError(null);
    setTxResult(null);
    bottomSheetRef?.current?.dismiss();
  }, [bottomSheetRef, loader]);

  const { formPreviewData, successPreviewData } =
    useParsePreviewData(previewData);

  const successTitleData = useMemo(
    () => (
      <Row alignItems="center">
        <TokenLogo token={'amb'} />
        <Spacer horizontal value={scale(8)} />
        <Text
          fontFamily="Inter_500Medium"
          fontSize={24}
          color={COLORS.neutral900}
        >
          {NumberUtils.limitDecimalCount(previewData.receiveAmount, 2)}{' '}
          {previewData.receiveToken}
        </Text>
      </Row>
    ),
    [previewData?.receiveAmount, previewData?.receiveToken]
  );

  const content = useMemo(() => {
    switch (true) {
      case !!txResult: {
        updateAll(wallet?.address || '');
        return (
          <PreviewSuccess
            title={t('harbor.successfully.stake.header')}
            titleData={successTitleData}
            onClose={onPreviewClose}
            formPreviewData={successPreviewData}
            transaction={txResult}
          />
        );
      }
      case !!processError:
        return <PreviewError onClose={onPreviewClose} />;
      default:
        return (
          <PreviewForm
            loader={loader}
            formPreviewData={formPreviewData}
            onAcceptPress={onPressAccept}
          />
        );
    }
  }, [
    formPreviewData,
    loader,
    onPressAccept,
    onPreviewClose,
    processError,
    successPreviewData,
    successTitleData,
    t,
    txResult,
    updateAll,
    wallet?.address
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
