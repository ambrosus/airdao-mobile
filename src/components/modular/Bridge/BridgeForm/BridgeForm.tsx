import React, { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, LayoutChangeEvent, View } from 'react-native';
import { styles } from './styles';
import {
  Button,
  Input,
  KeyboardDismissingView,
  Row,
  Spacer,
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
import { BottomSheetChoseToken } from '@components/templates/BottomSheetChoseToken';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { RenderTokenItem } from '@models/Bridge';

const KEYBOARD_VERTICAL_OFFSET = 155;

export const BridgeForm = () => {
  const choseTokenRef = useRef<BottomSheetRef>(null);

  const { t } = useTranslation();
  const [currencySelectorWidth, setCurrencySelectorWidth] = useState<number>(0);
  const [amountToExchange, setAmountToExchange] = useState('');

  const onCurrencySelectorLayoutHandle = (event: LayoutChangeEvent) => {
    setCurrencySelectorWidth(event.nativeEvent.layout.width);
  };

  const inputStyles = useMemo(() => {
    return {
      ...styles.input,
      paddingLeft: currencySelectorWidth + 24
    };
  }, [currencySelectorWidth]);

  const onChangeAmount = (value: string) => {
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 3);
    setAmountToExchange(finalValue);
  };

  const onSelectMaxAmount = () => {
    setAmountToExchange('999');
  };

  const { networksParams, tokenParams } = useBridgeContextSelector();

  const onTokenPress = (item: RenderTokenItem) => {
    tokenParams.setter(item);
    setTimeout(() => choseTokenRef?.current?.dismiss(), 200);
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
            Amount to bridge
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
                Max
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
                You’ll receive
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
                Network fee
              </Text>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.black}
              >
                ...AMB
              </Text>
            </Row>
          </View>
        </View>

        <PrimaryButton onPress={() => null}>
          <Text color={COLORS.neutral0}>{t('button.preview')}</Text>
        </PrimaryButton>
        <BottomSheetChoseToken
          ref={choseTokenRef}
          renderData={networksParams.value}
          // @ts-ignore
          onPressItem={onTokenPress}
        />
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
