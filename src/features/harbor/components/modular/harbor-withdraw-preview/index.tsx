import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { BottomSheetHarborWithdrawPreViewProps } from './models';
import { useWalletStore } from '@entities/wallet';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { isAndroid } from '@utils/isPlatform';
import { PreviewError } from '@features/harbor/components/modular/preview-error';
import { PreviewForm } from '@features/harbor/components/modular/preview-form';
import { useHarborWithdrawPreview } from '@features/harbor/components/modular/harbor-withdraw-preview/hooks/useHarborWithdrawPreview';
import { harborService } from '@api/harbor/harbor-service';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { Transaction } from '@models';
import { PreviewSuccess } from '@features/harbor/components/modular/preview-success';
import { NumberUtils } from '@utils/number';
import { CryptoCurrencyCode } from '@appTypes';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { delay } from '@utils/delay';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';

export const BottomSheetHarborWithdrawPreView = forwardRef<
  BottomSheetRef,
  BottomSheetHarborWithdrawPreViewProps
>(({ previewData }, ref) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();
  const { wallet } = useWalletStore();
  const { activeAmbTier, updateAll } = useHarborStore();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const bottomSheetRef = useForwardedRef(ref);

  const [loader, setLoader] = useState<boolean>(false);
  const [processError, setProcessError] = useState<unknown>(null);
  const [txResult, setTxResult] = useState<Transaction | null>(null);

  const onPressAccept = useCallback(async () => {
    try {
      setLoader(true);
      const tx = await harborService.processWithdraw(
        wallet?._raw,
        previewData.amount,
        activeAmbTier.value
      );
      setTxResult(tx);
    } catch (e) {
      setProcessError(e);
    } finally {
      setLoader(false);
    }
  }, [activeAmbTier?.value, previewData?.amount, wallet?._raw]);

  const onPreviewClose = useCallback(() => {
    if (loader) {
      return;
    }
    setProcessError(null);
    setTxResult(null);
    bottomSheetRef?.current?.dismiss();
  }, [bottomSheetRef, loader]);
  const { formParsedData, successParsedData } =
    useHarborWithdrawPreview(previewData);

  const navigateToToMyRequest = useCallback(async () => {
    onPreviewClose();
    await delay(300);
    navigation.navigate('WithdrawRequests');
  }, [navigation, onPreviewClose]);

  const extraButton = useMemo(
    () => ({
      title: 'harbor.requests.header',
      onPress: navigateToToMyRequest,
      type: 'secondary'
    }),
    [navigateToToMyRequest]
  );

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
          {NumberUtils.limitDecimalCount(previewData.amount, 2)}{' '}
          {CryptoCurrencyCode.stAMB}
        </Text>
      </Row>
    ),
    [previewData?.amount]
  );

  const content = useMemo(() => {
    switch (true) {
      case !!txResult: {
        updateAll(wallet?.address || '');
        return (
          <PreviewSuccess
            extraButton={extraButton}
            title={t('harbor.successfully.withdraw.header')}
            titleData={successTitleData}
            onClose={onPreviewClose}
            formPreviewData={successParsedData}
            transaction={txResult}
          />
        );
      }
      case !!processError:
        return <PreviewError onClose={onPreviewClose} />;
      default:
        return (
          <PreviewForm
            btnTitle={t('harbor.withdraw.header')}
            loader={loader}
            formPreviewData={formParsedData}
            onAcceptPress={onPressAccept}
          />
        );
    }
  }, [
    extraButton,
    formParsedData,
    loader,
    onPressAccept,
    onPreviewClose,
    processError,
    successParsedData,
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
