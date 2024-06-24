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
import { scale, verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef } from '@components/composite';
import { useBridgeContextData } from '@contexts/Bridge';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { BottomSheetBridgePreview } from '../../../templates/BottomSheetBridgePreview/BottomSheetBridgePreview';
import { useBridgeNetworksData } from '@hooks/bridge/useBridgeNetworksData';
import { BalanceInfo, FeeInfo, TokenSelector } from './components';
import { useBridgeTransactionStatus } from '@hooks/useBridgeTransactionStatus';
import { BottomSheetBridgeTransactionPendingHistory } from '@components/templates/Bridge/BottomSheetBridgeTransactionPendingHistory';
import { BottomSheetBridgeItemSelector } from '@components/templates/Bridge/BottomSheetBridgeItemSelector';

const KEYBOARD_VERTICAL_OFFSET = 155;

export const BridgeForm = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const choseTokenRef = useRef<BottomSheetRef>(null);
  const previewRef = useRef<BottomSheetRef>(null);
  const transactionInfoRef = useRef<BottomSheetRef>(null);

  const { t } = useTranslation();
  const [timeoutDelay, setTimeoutDelay] = useState(setTimeout(() => null));
  const { tokenParams, fromParams, toParams } = useBridgeContextData();
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
    setBridgeFee,
    onPressPreview,
    onWithdrawApprove,
    setFeeLoader
  } = methods;
  const {
    dataToPreview,
    amountToExchange,
    inputStyles,
    feeLoader,
    bridgeFee,
    gasFeeLoader,
    bridgeTransaction,
    bridgeTransfer,
    inputError,
    isMax
  } = variables;
  const { confirmations, minSafetyBlocks, stage } = useBridgeTransactionStatus(
    bridgeTransaction?.withdrawTx,
    !!Object.keys(bridgeTransfer).length
  );

  useEffect(() => {
    if (!isMax) {
      setBridgeFee(null);
      if (!!amountToExchange && !inputError) {
        clearTimeout(timeoutDelay);
        setFeeLoader(true);
        setTimeoutDelay(
          setTimeout(async () => {
            await getFeeData();
          }, 1000)
        );
      }
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
                symbol={tokenParams.value.renderTokenItem.symbol ?? ''}
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
            {!!inputError && (
              <>
                <Spacer value={verticalScale(4)} />
                <Text
                  fontSize={12}
                  fontFamily="Inter_500Medium"
                  fontWeight="500"
                  color={COLORS.error400}
                >
                  {inputError}
                </Text>
              </>
            )}
            <Spacer value={scale(8)} />
            <BalanceInfo onMaxPress={onSelectMaxAmount} />
          </View>

          <Spacer value={scale(32)} />
          <FeeInfo
            amount={amountToExchange}
            symbol={tokenParams.value.renderTokenItem.symbol}
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
        <BottomSheetBridgeItemSelector
          ref={choseTokenRef}
          onPressItem={onTokenPress}
          selectorType={'token'}
        />
        <BottomSheetBridgePreview
          btnTitle={t('bridge.preview.button').replace(
            '{network}',
            toParams.value.name
          )}
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
