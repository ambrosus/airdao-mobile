import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { styles } from './styles';
import {
  Button,
  Input,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { COLORS } from '@constants/colors';
import { ChevronDownIcon } from '@components/svg/icons';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { DeviceUtils } from '@utils/device';
import { scale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetChoseToken } from '../../../templates/Bridge/BottomSheetChoseToken';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { BottomSheetBridgePreview } from '@components/templates/BottomSheetBridgePreview/BottomSheetBridgePreview';
import { useBridgeNetworksData } from '@hooks/useBridgeNetworksData';
import { FeeData } from '@api/bridge/sdk/types';

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

  const { t } = useTranslation();
  const [timeoutDelay, setTimeoutDelay] = useState(setTimeout(() => null));
  const { networksParams, tokenParams, fromParams, toParams } =
    useBridgeContextSelector();
  const { methods, variables } = useBridgeNetworksData({
    choseTokenRef,
    previewRef
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
    onPressPreview
  } = methods;
  const {
    dataToPreview,
    amountToExchange,
    inputStyles,
    feeLoader,
    bridgeFee,
    selectedTokenBalance,
    balanceLoader,
    gasFeeLoader
  } = variables;

  useEffect(() => {
    setFeeLoader(true);
    setBridgeFee(null);
    getSelectedTokenBalance().then();
    if (!!amountToExchange) {
      clearTimeout(timeoutDelay);
      setTimeoutDelay(setTimeout(() => getFeeData(), 1000));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountToExchange, toParams.value.id, fromParams.value.id, tokenParams]);

  const onPasscodeApprove = () => {
    // console.log('APPROVE!!!!');
  };
  const onAcceptPress = () => {
    navigation.navigate('Passcode', {
      onPasscodeApprove
    });
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
              <Button onPress={() => choseTokenRef.current?.show()}>
                <Row style={styles.currencySelectorGap} alignItems="center">
                  <TokenLogo
                    scale={0.7}
                    token={tokenParams.value.renderTokenItem.symbol}
                  />
                  <Row
                    style={styles.currencySelectorInnerGap}
                    alignItems="center"
                  >
                    <Text
                      fontSize={16}
                      fontFamily="Inter_500Medium"
                      color={COLORS.alphaBlack60}
                    >
                      {tokenParams.value.renderTokenItem.symbol}
                    </Text>
                    <ChevronDownIcon scale={0.45} color={COLORS.alphaBlack60} />
                  </Row>
                </Row>
              </Button>
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
            <Row style={styles.balanceContainer} alignItems="center">
              <Text
                fontSize={14}
                fontFamily="Inter_400Regular"
                color={COLORS.alphaBlack60}
              >
                {t('common.balance')}:
              </Text>
              {balanceLoader ? (
                <>
                  <Spacer value={10} horizontal />
                  <Spinner customSize={15} />
                </>
              ) : (
                selectedTokenBalance && (
                  <>
                    <Text
                      fontSize={14}
                      fontFamily="Inter_400Regular"
                      color={COLORS.alphaBlack60}
                    >
                      {`${selectedTokenBalance} ${tokenParams.value.renderTokenItem.symbol}`}
                    </Text>

                    {Number(selectedTokenBalance) > 0 && (
                      <Text
                        fontSize={14}
                        fontFamily="Inter_700Bold"
                        color={COLORS.sapphireBlue}
                        onPress={onSelectMaxAmount}
                      >
                        {t('bridge.preview.button.max')}
                      </Text>
                    )}
                  </>
                )
              )}
            </Row>
          </View>

          <Spacer value={scale(32)} />
          <View style={styles.information}>
            <Row alignItems="center" justifyContent="space-between">
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral400}
              >
                {t('bridge.amount.to.receive')}
              </Text>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.black}
              >
                {`${amountToExchange} ${tokenParams.value.renderTokenItem.symbol}`}
              </Text>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              {!!amountToExchange &&
                (feeLoader ? (
                  <Spinner customSize={15} />
                ) : bridgeFee ? (
                  <>
                    <Text
                      fontSize={14}
                      fontFamily="Inter_500Medium"
                      color={COLORS.neutral400}
                    >
                      {t('bridge.amount.network.fee')}
                    </Text>
                    <Text
                      fontSize={14}
                      fontFamily="Inter_500Medium"
                      color={COLORS.black}
                    >
                      {`${bridgeFee?.feeSymbol} ${bridgeFee?.networkFee}`}
                    </Text>
                  </>
                ) : (
                  <></>
                ))}
            </Row>
          </View>
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
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
