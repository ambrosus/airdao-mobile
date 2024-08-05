import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { styles } from './styles';
import { InputWithIcon } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { MarketType, Token } from '@features/kosmos/types';
import { verticalScale } from '@utils/scaling';
import { useTransactionErrorHandler } from '@features/kosmos/lib/hooks';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';

interface BuyBondInputWithErrorProps {
  onFocus: () => void;
  onBlur: () => void;
  quoteToken: Token | undefined;
  market: MarketType;
}

export const BuyBondInputWithError = ({
  onFocus,
  onBlur,
  quoteToken,
  market
}: BuyBondInputWithErrorProps) => {
  const { error } = useTransactionErrorHandler(market);
  const { amountToBuy, onChangeAmountToBuy } =
    useKosmosMarketsContextSelector();

  const [leftInputContentWidth, setLeftInputContentWidth] = useState(0);

  const onRenderInputLeftContentLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;

      setLeftInputContentWidth(width);
    },
    []
  );

  const onChangeAmountToBuyHandle = (amount: string) => {
    let finalValue = StringUtils.formatNumberInput(amount);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 18);
    onChangeAmountToBuy(finalValue);
  };

  const renderInputLeftContent = useMemo(() => {
    return (
      <View
        onLayout={onRenderInputLeftContentLayoutHandler}
        style={styles.inputLeftContainer}
      >
        <TokenLogo scale={0.65} token={quoteToken?.symbol ?? ''} />
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.alphaBlack60}
        >
          {quoteToken?.symbol}
        </Text>
      </View>
    );
  }, [onRenderInputLeftContentLayoutHandler, quoteToken?.symbol]);

  return (
    <View>
      <InputWithIcon
        value={amountToBuy}
        onChangeValue={onChangeAmountToBuyHandle}
        keyboardType="numeric"
        style={styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="0"
        placeholderTextColor={COLORS.alphaBlack60}
        iconLeft={renderInputLeftContent}
        spacingLeft={leftInputContentWidth}
        spacingRight={0}
      />
      {error !== '' && (
        <>
          <Spacer value={verticalScale(4)} />
          <Text
            fontSize={12}
            fontFamily="Inter_500Medium"
            fontWeight="500"
            color={COLORS.error400}
          >
            {error}
          </Text>
        </>
      )}
    </View>
  );
};
