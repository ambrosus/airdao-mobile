import React, { forwardRef, RefObject, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { CloseCircleIcon } from '@components/svg/icons/v2';
import { Row, Spacer, Text } from '@components/base';
import { useBridgeContextData } from '@features/bridge/context';
import { amountCheckers } from '@features/bridge/templates/BottomSheetBridgePreview/helpers/amountChecker';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { TouchableOpacity, View } from 'react-native';
import { GeneralPreviewTemplate, Loader } from './components/index';

const DEFAULT_TRANSACTION = {
  eventId: '',
  networkFrom: '',
  networkTo: '',
  tokenFrom: '',
  tokenTo: '',
  userTo: '',
  amount: 0,
  decimalAmount: 0,
  denominatedAmount: 0,
  fee: '',
  withdrawTx: '',
  timestampStart: 0,
  transferFinishTxHash: '',
  wait: ''
};

interface BottomSheetChoseNetworksProps {
  ref: RefObject<BottomSheetRef>;
}

export const BottomSheetBridgePreview = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const [previewLoader, setPreviewLoader] = useState(false);
  const { t } = useTranslation();
  const { variables, methods } = useBridgeContextData();
  const {
    selectedTokenPairs,
    selectedTokenFrom,
    selectedTokenDestination,
    networkNativeToken,
    bridgePreviewData,
    fromData,
    destinationData,
    amountToBridge,
    processingTransaction
  } = variables;
  const { processBridge, setProcessingTransaction, bridgeErrorHandler } =
    methods;

  const dataToPreview = bridgePreviewData?.dataToPreview ?? [];

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

  const setDefaultOptions = () => {
    setTimeout(() => {
      setPreviewLoader(false);
      setProcessingTransaction(null);
    }, 200);
  };
  const onClose = () => {
    setDefaultOptions();
    // @ts-ignore
    ref?.current?.dismiss();
  };

  const onAcceptPress = async () => {
    try {
      setPreviewLoader(true);
      const transaction = await processBridge(
        false,
        bridgePreviewData.value.feeData
      );
      const transactionWaitingInfo = {
        ...DEFAULT_TRANSACTION,
        networkFrom: fromData.value.name,
        networkTo: destinationData.value.name,
        tokenFrom: selectedTokenFrom,
        tokenTo: selectedTokenDestination,
        amount: +formatUnits(
          bridgePreviewData.value.feeData.transferFee,
          selectedTokenFrom.decimals
        ),
        decimalAmount: amountToBridge,
        denominatedAmount: amountToBridge,
        fee: formatUnits(
          bridgePreviewData.value.feeData.transferFee,
          selectedTokenFrom.decimals
        ),
        wait: transaction.wait
      };
      setProcessingTransaction(transactionWaitingInfo);
    } catch (e) {
      bridgeErrorHandler(e);
    }
  };

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
    <BottomSheet
      onBackdropPress={setDefaultOptions}
      ref={ref}
      swiperIconVisible={true}
    >
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
