import React, { useEffect, useMemo, useState } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { formatEther } from 'ethers/lib/utils';
import { Text, Row, Spinner } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapTokens, useSwapBetterRate } from '@features/swap/lib/hooks';
import { SwapStringUtils, plateVisibility } from '@features/swap/utils';
import { verticalScale } from '@utils';

export const SwapCurrencyRate = () => {
  const { _refExactGetter, _refSettingsGetter } = useSwapContextSelector();
  const { tokensRoute, tokenToSell, tokenToReceive } = useSwapTokens();
  const { bestSwapRate, onToggleTokensOrder, tokens, isExecutingRate } =
    useSwapBetterRate();

  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  useEffect(() => {
    (async () => {
      if (tokenToSell.TOKEN && tokenToReceive.TOKEN) {
        const bnAmount = await bestSwapRate(tokensRoute);

        const normalizedAmount = SwapStringUtils.transformAmountValue(
          formatEther(bnAmount?._hex)
        );

        setOppositeAmountPerOneToken(normalizedAmount);
      }
    })();
  }, [
    _refExactGetter,
    _refSettingsGetter,
    bestSwapRate,
    tokenToReceive.TOKEN,
    tokenToSell.TOKEN,
    tokensRoute
  ]);

  const isShowPlate = useMemo(() => {
    return plateVisibility(
      tokenToSell.TOKEN,
      tokenToSell.AMOUNT,
      tokenToReceive.TOKEN,
      tokenToReceive.AMOUNT,
      oppositeAmountPerOneToken
    );
  }, [oppositeAmountPerOneToken, tokenToReceive, tokenToSell]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      paddingBottom: verticalScale(20)
    };
  }, []);

  if (!isShowPlate) {
    return null;
  }

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
