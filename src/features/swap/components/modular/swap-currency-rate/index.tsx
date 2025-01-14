import React, { memo, useEffect, useMemo, useState } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { formatEther } from 'ethers/lib/utils';
import { Text, Row, Spinner } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapBetterRate } from '@features/swap/lib/hooks';
import { SwapStringUtils } from '@features/swap/utils';
import { verticalScale } from '@utils';

interface SwapCurrencyRateProps {
  tokenToSell: string;
  tokenToReceive: string;
  tokensRoute: string[];
}

const _SwapCurrencyRate = ({
  tokenToSell,
  tokenToReceive,
  tokensRoute
}: SwapCurrencyRateProps) => {
  const { bestSwapRate, onToggleTokensOrder, tokens, isExecutingRate } =
    useSwapBetterRate();

  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  useEffect(() => {
    (async () => {
      if (tokenToSell && tokenToReceive) {
        const bnAmount = await bestSwapRate(tokensRoute);

        const normalizedAmount = SwapStringUtils.transformAmountValue(
          formatEther(bnAmount?._hex)
        );

        setOppositeAmountPerOneToken(normalizedAmount);
      }
    })();
  }, [bestSwapRate, tokenToReceive, tokenToSell, tokensRoute]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      height: 52,
      paddingBottom: verticalScale(20)
    };
  }, []);

  return (
    <Row style={containerStyle} justifyContent="center" alignItems="center">
      {isExecutingRate ? (
        <Spinner customSize={17.5} />
      ) : (
        <TouchableOpacity onPress={onToggleTokensOrder}>
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.brand500}
          >
            1 {tokens.symbolInput ?? 'AMB'} = {oppositeAmountPerOneToken}{' '}
            {tokens.symbolOutput}
          </Text>
        </TouchableOpacity>
      )}
    </Row>
  );
};

export const SwapCurrencyRate = memo(
  _SwapCurrencyRate,
  (prevProps, nextProps) =>
    prevProps.tokenToReceive === nextProps.tokenToReceive &&
    prevProps.tokenToSell === nextProps.tokenToSell
);
