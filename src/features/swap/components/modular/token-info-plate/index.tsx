import React, { useEffect, useMemo, useState } from 'react';
import { Text, Row } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { useSwapActions } from '@features/swap/lib/hooks';
import { SwapStringUtils, executeSwapPath } from '@features/swap/utils';
import { formatEther } from 'ethers/lib/utils';
import { COLORS } from '@constants/colors';

export const TokenInfoPlate = () => {
  const { selectedTokens, selectedTokensAmount, _refExactGetter } =
    useSwapContextSelector();
  const { getOppositeReceivedTokenAmount } = useSwapActions();
  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  const symbols = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;

    if (TOKEN_A && TOKEN_B) {
      return {
        TOKEN_A: _refExactGetter ? TOKEN_A.symbol : TOKEN_B.symbol,
        TOKEN_B: !_refExactGetter ? TOKEN_A.symbol : TOKEN_B.symbol
      };
    }
  }, [_refExactGetter, selectedTokens]);

  useEffect(() => {
    (async () => {
      const { TOKEN_A, TOKEN_B } = selectedTokens;

      if (TOKEN_A && TOKEN_B) {
        const path = executeSwapPath(_refExactGetter, [
          TOKEN_A.address,
          TOKEN_B.address
        ]);

        const bnAmount = await getOppositeReceivedTokenAmount('1', path);

        const normalizedAmount = SwapStringUtils.transformAmountValue(
          formatEther(bnAmount?._hex)
        );

        setOppositeAmountPerOneToken(normalizedAmount);
      }
    })();
  }, [_refExactGetter, getOppositeReceivedTokenAmount, selectedTokens]);

  const TokenUSDPrice = useUSDPrice(1, symbols?.TOKEN_A as CryptoCurrencyCode);

  const isShowPlate = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    return (
      TOKEN_A &&
      AMOUNT_A !== '' &&
      TOKEN_B &&
      AMOUNT_B !== '' &&
      oppositeAmountPerOneToken !== '' &&
      TokenUSDPrice !== 0
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
        1 {symbols?.TOKEN_A ?? 'AMB'} ($
        {SwapStringUtils.transformAmountValue(String(TokenUSDPrice))}) ={' '}
        {oppositeAmountPerOneToken} {symbols?.TOKEN_B}
      </Text>
    </Row>
  ) : (
    <></>
  );
};
