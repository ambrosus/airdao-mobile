import React, { useEffect, useMemo, useState } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { Text, Row } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { useSwapTokens } from '@features/swap/lib/hooks';
import { SwapStringUtils, plateVisibility } from '@features/swap/utils';
import { COLORS } from '@constants/colors';
import { useSwapBetterRate } from '@features/swap/lib/hooks/use-swap-better-rate';

export const TokenInfoPlate = () => {
  const { _refExactGetter, _refSettingsGetter } = useSwapContextSelector();
  const { tokensRoute, tokenToSell, tokenToReceive } = useSwapTokens();
  const { bestSwapRate } = useSwapBetterRate();

  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  useEffect(() => {
    (async () => {
      if (tokenToSell.TOKEN && tokenToReceive.TOKEN) {
        const bnAmount = await bestSwapRate('1', tokensRoute);

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

  const TokenUSDPrice = useUSDPrice(
    1,
    tokenToReceive.TOKEN?.symbol as CryptoCurrencyCode
  );

  const isUSDPriceNegative = useMemo(() => {
    return TokenUSDPrice < 0;
  }, [TokenUSDPrice]);

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
        1 {tokenToReceive.TOKEN?.symbol ?? 'AMB'}{' '}
        {!isUSDPriceNegative && (
          <>
            ($
            {`${SwapStringUtils.transformAmountValue(String(TokenUSDPrice))}`})
          </>
        )}
        = {oppositeAmountPerOneToken} {tokenToSell.TOKEN?.symbol}
      </Text>
    </Row>
  ) : (
    <></>
  );
};
