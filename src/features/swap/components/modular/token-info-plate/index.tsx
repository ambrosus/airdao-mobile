import React, { useEffect, useMemo, useState } from 'react';
import { Text, Row } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { useSwapActions, useSwapTokens } from '@features/swap/lib/hooks';
import {
  SwapStringUtils,
  plateVisibility,
  resolvePlateSymbol
} from '@features/swap/utils';
import { formatEther } from 'ethers/lib/utils';
import { COLORS } from '@constants/colors';

export const TokenInfoPlate = () => {
  const { _refExactGetter, _refSettingsGetter } = useSwapContextSelector();

  const { getTokenAmountOut } = useSwapActions();
  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  const { tokensRoute, tokenToSell, tokenToReceive } = useSwapTokens();

  const symbols = useMemo(() => {
    const [symbolA, symbolB] = [
      tokenToSell.TOKEN?.symbol,
      tokenToReceive.TOKEN?.symbol
    ];

    if (symbolA && symbolB) {
      return resolvePlateSymbol(symbolA, symbolB);
    }
  }, [tokenToReceive.TOKEN?.symbol, tokenToSell.TOKEN?.symbol]);

  useEffect(() => {
    (async () => {
      if (tokenToSell.TOKEN && tokenToSell.TOKEN) {
        const bnAmount = await getTokenAmountOut('1', tokensRoute);

        const normalizedAmount = SwapStringUtils.transformAmountValue(
          formatEther(bnAmount?._hex)
        );

        setOppositeAmountPerOneToken(normalizedAmount);
      }
    })();
  }, [
    _refExactGetter,
    _refSettingsGetter,
    getTokenAmountOut,
    tokenToReceive.TOKEN,
    tokenToSell.TOKEN,
    tokensRoute
  ]);

  const TokenUSDPrice = useUSDPrice(1, symbols?.TOKEN_A as CryptoCurrencyCode);

  const isShowPlate = useMemo(() => {
    return plateVisibility(
      tokenToSell.TOKEN,
      tokenToSell.AMOUNT,
      tokenToReceive.TOKEN,
      tokenToReceive.AMOUNT,
      oppositeAmountPerOneToken,
      TokenUSDPrice
    );
  }, [TokenUSDPrice, oppositeAmountPerOneToken, tokenToReceive, tokenToSell]);

  return isShowPlate ? (
    <Row justifyContent="center" alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_600SemiBold"
        color={COLORS.brand500}
      >
        1 {tokenToSell.TOKEN?.symbol ?? 'AMB'} ($
        {SwapStringUtils.transformAmountValue(String(TokenUSDPrice))}) ={' '}
        {oppositeAmountPerOneToken} {tokenToReceive.TOKEN?.symbol}
      </Text>
    </Row>
  ) : (
    <></>
  );
};
