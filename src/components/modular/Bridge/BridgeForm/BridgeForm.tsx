import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, LayoutChangeEvent, View } from 'react-native';
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
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { DeviceUtils } from '@utils/device';
import { scale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetChoseToken } from '../../../templates/Bridge/BottomSheetChoseToken';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { RenderTokenItem } from '@models/Bridge';
import { API } from '@api/api';
// import { useNavigation } from '@react-navigation/native';
// import { RootNavigationProp } from '@appTypes';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { BottomSheetBridgePreview } from '@components/templates/BottomSheetBridgePreview/BottomSheetBridgePreview';
import { CurrencyUtils } from '@utils/currency';
import { formatEther } from 'ethers/lib/utils';

interface BridgeFeeModel {
  amount: number | string;
  networkFee: string | number;
  feeSymbol: string;
  bridgeAmount: string | number;
}

const KEYBOARD_VERTICAL_OFFSET = 155;
const DECIMAL_CRYPTO_LIMIT = 5;
const DECIMAL_USD_LIMIT = 2;

export const BridgeForm = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const choseTokenRef = useRef<BottomSheetRef>(null);
  const previewRef = useRef<BottomSheetRef>(null);

  const { t } = useTranslation();
  const [isMax, setMax] = useState(false);
  const [currencySelectorWidth, setCurrencySelectorWidth] = useState<number>(0);
  const [amountToExchange, setAmountToExchange] = useState('');
  const [bridgeFee, setBridgeFee] = useState<BridgeFeeModel | null>(null);
  const [timeoutDelay, setTimeoutDelay] = useState(setTimeout(() => null));
  const [feeLoader, setFeeLoader] = useState(false);
  const { networksParams, bridgeConfig, tokenParams, fromParams, toParams } =
    useBridgeContextSelector();

  const onCurrencySelectorLayoutHandle = (event: LayoutChangeEvent) => {
    setCurrencySelectorWidth(event.nativeEvent.layout.width);
  };

  const inputStyles = useMemo(() => {
    return {
      ...styles.input,
      paddingLeft: currencySelectorWidth + 24
    };
  }, [currencySelectorWidth]);

  const getFeeData = async () => {
    const dataForFee = {
      tokenFrom: tokenParams.value.pairs[0],
      tokenTo: tokenParams.value.pairs[1],
      amountTokens: amountToExchange,
      isMax
    };
    try {
      const fee = await API.bridgeService.bridgeSDK.getFeeData({
        bridgeConfig,
        dataForFee
      });
      setBridgeFee({
        amount: formatEther(fee.amount._hex),
        feeSymbol: fee.feeSymbol.toUpperCase(),
        networkFee: NumberUtils.limitDecimalCount(
          Number(formatEther(fee.transferFee._hex)),
          DECIMAL_CRYPTO_LIMIT
        ),
        bridgeAmount: NumberUtils.limitDecimalCount(
          Number(formatEther(fee.bridgeFee._hex)),
          DECIMAL_CRYPTO_LIMIT
        )
      });
    } catch (e) {
      // ignore
    } finally {
      setFeeLoader(false);
    }
  };

  useEffect(() => {
    setFeeLoader(true);
    setBridgeFee(null);
    if (!!amountToExchange) {
      clearTimeout(timeoutDelay);
      setTimeoutDelay(setTimeout(() => getFeeData(), 1000));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountToExchange, toParams.value.id, fromParams.value.id, tokenParams]);

  const onChangeAmount = (value: string) => {
    setMax(false);
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(
      finalValue,
      DECIMAL_CRYPTO_LIMIT
    );
    setAmountToExchange(finalValue);
  };

  const dataToPreview = (() => {
    const receiveDataUSD = NumberUtils.limitDecimalCount(
      CurrencyUtils.toUSD(+amountToExchange, 0.2),
      DECIMAL_USD_LIMIT
    );
    const bridgeFeeAmount = bridgeFee?.bridgeAmount;
    const networkFee = bridgeFee?.networkFee;
    // symbol destination = 0 -> from || 1 -> to
    const symbol = (destination: number) =>
      tokenParams.value.pairs[destination].symbol;
    return [
      // TODO BRIDGE refactor
      {
        name: t('bridge.preview.receive'),
        cryptoAmount: amountToExchange,
        usdAmount: receiveDataUSD,
        symbol: symbol(1)
      },
      {
        name: t('bridge.preview.bridge.fee'),
        cryptoAmount: bridgeFeeAmount,
        symbol: bridgeFee?.feeSymbol
      },
      {
        name: t('bridge.preview.network.fee'),
        cryptoAmount: networkFee,
        symbol: bridgeFee?.feeSymbol
      }
    ];
  })();

  const onSelectMaxAmount = () => {
    if (tokenParams.value.renderTokenItem.isNativeCoin) {
      setMax(true);
    }
    setAmountToExchange('999');
  };

  const onTokenPress = (item: RenderTokenItem) => {
    if (!item.renderTokenItem.isNativeCoin) {
      setMax(false);
    }
    tokenParams.setter(item);
    setTimeout(() => choseTokenRef?.current?.dismiss(), 200);
  };
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
                {t('common.balance')}: 10,103{' '}
                {tokenParams.value.renderTokenItem.symbol}
              </Text>

              <Text
                fontSize={14}
                fontFamily="Inter_700Bold"
                color={COLORS.sapphireBlue}
                onPress={onSelectMaxAmount}
              >
                {t('bridge.preview.button.max')}
              </Text>
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
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral400}
              >
                {t('bridge.amount.network.fee')}
              </Text>
              {!!amountToExchange &&
                (feeLoader ? (
                  <Spinner customSize={15} />
                ) : (
                  <Text
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    color={COLORS.black}
                  >
                    {`${bridgeFee?.feeSymbol} ${bridgeFee?.networkFee}`}
                  </Text>
                ))}
            </Row>
          </View>
        </View>

        <PrimaryButton
          onPress={() => previewRef?.current?.show()}
          disabled={!amountToExchange || !bridgeFee}
        >
          <Text color={COLORS.neutral0}>{t('button.preview')}</Text>
        </PrimaryButton>
        <BottomSheetChoseToken
          ref={choseTokenRef}
          renderData={networksParams.value}
          // @ts-ignore
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
