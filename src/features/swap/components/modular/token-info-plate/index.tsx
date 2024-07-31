import React, { useEffect, useMemo, useState } from 'react';
import { Text, Row } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { useSwapActions, useSwapTokens } from '@features/swap/lib/hooks';
import { SwapStringUtils, plateVisibility } from '@features/swap/utils';
import { formatEther } from 'ethers/lib/utils';
import { COLORS } from '@constants/colors';

export const TokenInfoPlate = () => {
  const { _refExactGetter, _refSettingsGetter } = useSwapContextSelector();
  const { tokensRoute, tokenToSell, tokenToReceive } = useSwapTokens();
  const { getOppositeReceivedTokenAmount } = useSwapActions();

  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  useEffect(() => {
    (async () => {
      if (tokenToSell.TOKEN && tokenToReceive.TOKEN) {
        const route = _refExactGetter ? tokensRoute.reverse() : tokensRoute;
        const bnAmount = await getOppositeReceivedTokenAmount(
          '1',
          route,
          _refExactGetter
        );

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
    tokenToReceive.TOKEN,
    tokenToSell.TOKEN,
    tokensRoute
  ]);

  const TokenUSDPrice = useUSDPrice(
    1,
    tokenToReceive.TOKEN?.symbol as CryptoCurrencyCode
  );

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
        1 {tokenToReceive.TOKEN?.symbol ?? 'AMB'} ($
        {SwapStringUtils.transformAmountValue(String(TokenUSDPrice))}) ={' '}
        {oppositeAmountPerOneToken} {tokenToSell.TOKEN?.symbol}
      </Text>
    </Row>
  ) : (
    <></>
  );
};
