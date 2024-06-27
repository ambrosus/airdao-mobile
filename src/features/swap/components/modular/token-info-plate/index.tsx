import React, { useEffect, useMemo, useState } from 'react';
import { Text, Row } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { useSwapActions } from '@features/swap/lib/hooks';
import {
  SwapStringUtils,
  executeSwapPath,
  plateVisibility,
  resolvePlateSymbol
} from '@features/swap/utils';
import { formatEther } from 'ethers/lib/utils';
import { COLORS } from '@constants/colors';

export const TokenInfoPlate = () => {
  const {
    selectedTokens,
    selectedTokensAmount,
    _refExactGetter,
    _refSettingsGetter,
    isReversedTokens
  } = useSwapContextSelector();

  const { getOppositeReceivedTokenAmount } = useSwapActions();
  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  const symbols = useMemo(() => {
    const [symbolA, symbolB] = [
      selectedTokens.TOKEN_A?.symbol,
      selectedTokens.TOKEN_B?.symbol
    ];

    if (symbolA && symbolB) {
      return resolvePlateSymbol(
        isReversedTokens,
        _refExactGetter,
        symbolA,
        symbolB
      );
    }
  }, [_refExactGetter, isReversedTokens, selectedTokens]);

  useEffect(() => {
    (async () => {
      const { TOKEN_A, TOKEN_B } = selectedTokens;

      if (TOKEN_A && TOKEN_B) {
        const reversedPath = isReversedTokens
          ? [TOKEN_B.address, TOKEN_A.address]
          : [TOKEN_A.address, TOKEN_B.address];

        const path = executeSwapPath(
          _refExactGetter,
          reversedPath as [string, string]
        );

        const bnAmount = await getOppositeReceivedTokenAmount('1', path);

        const normalizedAmount = SwapStringUtils.transformAmountValue(
          formatEther(bnAmount?._hex)
        );

        setOppositeAmountPerOneToken(normalizedAmount);
      }
    })();
  }, [
    _refExactGetter,
    _refSettingsGetter,
    getOppositeReceivedTokenAmount,
    selectedTokens,
    isReversedTokens
  ]);

  const TokenUSDPrice = useUSDPrice(1, symbols?.TOKEN_A as CryptoCurrencyCode);

  const isShowPlate = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    return plateVisibility(
      TOKEN_A,
      AMOUNT_A,
      TOKEN_B,
      AMOUNT_B,
      oppositeAmountPerOneToken,
      TokenUSDPrice
    );
  }, [
    TokenUSDPrice,
    oppositeAmountPerOneToken,
    selectedTokens,
    selectedTokensAmount
  ]);

  return isShowPlate ? (
    <Row justifyContent="center" alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_600SemiBold"
        color={COLORS.brand500}
      >
        1 {selectedTokens.TOKEN_A?.symbol ?? 'AMB'} ($
        {SwapStringUtils.transformAmountValue(String(TokenUSDPrice))}) ={' '}
        {oppositeAmountPerOneToken} {selectedTokens.TOKEN_B?.symbol}
      </Text>
    </Row>
  ) : (
    <></>
  );
};
