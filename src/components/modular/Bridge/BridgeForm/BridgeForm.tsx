import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { styles } from './styles';
import {
  Input,
  KeyboardDismissingView,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { COLORS } from '@constants/colors';
import { PrimaryButton } from '@components/modular';
import { DeviceUtils } from '@utils/device';
import { scale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetChoseToken } from '../../../templates/Bridge/BottomSheetChoseToken';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { BottomSheetBridgePreview } from '../../../templates/BottomSheetBridgePreview/BottomSheetBridgePreview';
import { useBridgeNetworksData } from '@hooks/useBridgeNetworksData';
import { FeeData } from '@lib/bridgeSDK/models/types';
import {
  BalanceInfo,
  FeeInfo,
  TokenSelector
} from '@components/modular/Bridge/BridgeForm/components';
import { BottomSheetBridgeTransactionPendingHistory } from '@components/templates/Bridge/BottomSheetBridgeTransactionPendingHistory';
import { useBridgeTransactionStatus } from '@hooks/useBridgeTransactionStatus';

// TODO if user change network we need to save chosen token on input

export interface BridgeFeeModel {
  amount: number | string;
  networkFee: string | number;
  feeSymbol: string;
  bridgeAmount: string | number;
  feeData: FeeData;
}

const KEYBOARD_VERTICAL_OFFSET = 155;

export const BridgeForm = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const choseTokenRef = useRef<BottomSheetRef>(null);
  const previewRef = useRef<BottomSheetRef>(null);
  const transactionInfoRef = useRef<BottomSheetRef>(null);

  const { t } = useTranslation();
  const [timeoutDelay, setTimeoutDelay] = useState(setTimeout(() => null));
  const { networksParams, tokenParams, fromParams, toParams } =
    useBridgeContextSelector();
  const { methods, variables } = useBridgeNetworksData({
    choseTokenRef,
    previewRef,
    transactionInfoRef
  });
  const {
    getFeeData,
    onCurrencySelectorLayoutHandle,
    onSelectMaxAmount,
    onChangeAmount,
    onTokenPress,
    setFeeLoader,
    setBridgeFee,
    getSelectedTokenBalance,
    onPressPreview,
    onWithdrawApprove
  } = methods;
  const {
    dataToPreview,
    amountToExchange,
    inputStyles,
    feeLoader,
    bridgeFee,
    selectedTokenBalance,
    balanceLoader,
    gasFeeLoader,
    bridgeTransaction,
    bridgeTransfer
  } = variables;
  const { confirmations, minSafetyBlocks, stage } = useBridgeTransactionStatus(
    bridgeTransaction?.withdrawTx,
    !!Object.keys(bridgeTransfer).length
  );

  useEffect(() => {
    setFeeLoader(true);
    setBridgeFee(null);
    getSelectedTokenBalance(tokenParams.value.renderTokenItem).then();
    if (!!amountToExchange) {
      clearTimeout(timeoutDelay);
      setTimeoutDelay(setTimeout(() => getFeeData(), 1000));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    amountToExchange,
    toParams.value.id,
    fromParams.value.id,
    tokenParams.value.renderTokenItem
  ]);

  const onPasscodeApprove = async () => {
    setTimeout(async () => {
      await onWithdrawApprove();
    }, 1000);
  };
  const onAcceptPress = () => {
    previewRef?.current?.dismiss();
    setTimeout(() => {
      navigation.navigate('Passcode', {
        onPasscodeApprove
      });
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
      enabled={DeviceUtils.isIOS}
      style={styles.container}
      behavior="padding"
    >
      <KeyboardDismissingView style={styles.separatedContainer}>
        <View style={styles.inputContainerWitHeading}>
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {t('bridge.amount.to.bridge')}
          </Text>
          <View style={styles.inputContainerWithSelector}>
            <View
              onLayout={onCurrencySelectorLayoutHandle}
              style={styles.inputCurrencySelector}
            >
              <TokenSelector
                onPress={() => choseTokenRef.current?.show()}
                symbol={tokenParams.value.renderTokenItem.symbol}
              />
            </View>
            <Input
              style={inputStyles}
              type="number"
              keyboardType="decimal-pad"
              maxLength={9}
              value={amountToExchange}
              onChangeValue={onChangeAmount}
            />
            <Spacer value={scale(8)} />
            <BalanceInfo
              loader={balanceLoader}
              tokenBalance={selectedTokenBalance}
              tokenSymbol={tokenParams.value.renderTokenItem.symbol}
              onMaxPress={onSelectMaxAmount}
            />
          </View>

          <Spacer value={scale(32)} />
          <FeeInfo
            amount={amountToExchange}
            amountSymbol={tokenParams.value.renderTokenItem.symbol}
            feeLoader={feeLoader}
            bridgeFee={bridgeFee}
          />
        </View>

        <PrimaryButton
          onPress={onPressPreview}
          disabled={!amountToExchange || !bridgeFee || gasFeeLoader}
        >
          {gasFeeLoader ? (
            <Spinner customSize={15} />
          ) : (
            <Text color={COLORS.neutral0}>{t('button.preview')}</Text>
          )}
        </PrimaryButton>
        <BottomSheetChoseToken
          ref={choseTokenRef}
          renderData={networksParams.value}
          onPressItem={onTokenPress}
        />
        <BottomSheetBridgePreview
          dataToPreview={dataToPreview}
          ref={previewRef}
          onAcceptPress={onAcceptPress}
        />
        <BottomSheetBridgeTransactionPendingHistory
          ref={transactionInfoRef}
          // @ts-ignore
          transaction={bridgeTransaction}
          liveTransactionInformation={{
            stage,
            confirmations: {
              current: confirmations,
              minSafetyBlocks
            }
          }}
        />
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
