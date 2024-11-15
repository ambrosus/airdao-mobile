import React, { forwardRef, RefObject, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BigNumber } from 'ethers';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { CloseCircleIcon } from '@components/svg/icons/v2';
import { Row, Spacer, Text } from '@components/base';
import { useBridgeContextData } from '@features/bridge/context';
import { amountCheckers } from '@features/bridge/templates/BottomSheetBridgePreview/helpers/amountChecker';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { TouchableOpacity, View } from 'react-native';
import { GeneralPreviewTemplate, Loader } from './components/index';

interface BottomSheetChoseNetworksProps {
  ref: RefObject<BottomSheetRef>;
  onClose: () => void;
  onAcceptPress: () => void;
  previewLoader: boolean;
  bridgePreviewData: { dataToPreview: unknown[] };
}

export const BottomSheetBridgePreview = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>(({ onClose, onAcceptPress, previewLoader }, ref) => {
  const { t } = useTranslation();
  const { variables } = useBridgeContextData();
  const {
    selectedTokenPairs,
    selectedTokenFrom,
    networkNativeToken,
    bridgePreviewData,
    processingTransaction
  } = variables;

  const dataToPreview = useMemo(
    () => bridgePreviewData?.dataToPreview ?? [],
    [bridgePreviewData?.dataToPreview]
  );

  const errorBalance = useMemo(() => {
    const networkNativeTokenSymbol = networkNativeToken?.symbol ?? 'amb';
    if (selectedTokenFrom.symbol === networkNativeTokenSymbol) {
      let withdrawSum = BigNumber.from(0);
      dataToPreview
        .filter((item) => item.symbol === selectedTokenFrom?.symbol)
        .forEach((item) => (withdrawSum = withdrawSum.add(item.crypto.amount)));

      return amountCheckers.isAmountGraterThenBalance({
        balance: selectedTokenFrom.balance,
        amount: withdrawSum,
        token: networkNativeToken
      });
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTokenPairs, dataToPreview]);

  const PreviewContent = useMemo(() => {
    if (previewLoader) {
      return <Loader />;
    } else {
      return (
        <GeneralPreviewTemplate
          onClose={onClose}
          errorBalance={errorBalance}
          onAcceptPress={onAcceptPress}
        />
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorBalance, previewLoader]);

  const showHeader = useMemo(() => {
    return !processingTransaction && !previewLoader;
  }, [previewLoader, processingTransaction]);

  return (
    <BottomSheet onBackdropPress={onClose} ref={ref} swiperIconVisible={true}>
      <View style={{ marginHorizontal: scale(24) }}>
        {showHeader && (
          <>
            <Spacer value={20} />
            <Row justifyContent={'space-between'}>
              <Text
                numberOfLines={2}
                fontSize={scale(20)}
                fontFamily="Inter_700Bold"
                color={COLORS.neutral800}
              >
                {t('bridge.preview.title')}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <CloseCircleIcon />
              </TouchableOpacity>
            </Row>
          </>
        )}
        <Spacer value={verticalScale(18)} />
        {PreviewContent}
      </View>
    </BottomSheet>
  );
});
