import { useMemo } from 'react';
import { BigNumber, utils } from 'ethers';
import { MarketType } from '@features/kosmos/types';
import { useExtractToken } from './use-extract-token';
import {
  MAINNET_VESTINGS,
  TESTNET_VESTINGS
} from '@features/kosmos/utils/vestings';
import Config from '@constants/config';
import { formatDecimals } from '@features/kosmos/utils';
import { useMarketsTokens } from './use-market-tokens';

export function useMarketDetails(market: MarketType) {
  const { tokens } = useMarketsTokens();
  const { extractTokenCb } = useExtractToken();
  const payoutToken = extractTokenCb(market.payoutToken);
  const quoteToken = extractTokenCb(market.quoteToken);

  const assetValue = useMemo(() => {
    return (
      !!market?.capacity &&
      (
        +utils.formatUnits(
          BigNumber.from(market?.capacity),
          quoteToken?.decimals
        ) * (payoutToken?.price || 0)
      ).toFixed(2)
    );
  }, [market?.capacity, payoutToken?.price, quoteToken?.decimals]);

  const lockPeriod = useMemo(() => {
    if (!market.vesting) return null;

    const vestings =
      Config.env === 'testnet' ? TESTNET_VESTINGS : MAINNET_VESTINGS;

    return vestings.find((el) => el.value === +market.vesting)?.label;
  }, [market.vesting]);

  const availableAmount = useMemo(() => {
    if (!market.maxPayout) return null;

    return formatDecimals(
      utils.formatUnits(market.capacity, payoutToken?.decimals),
      payoutToken?.contractAddress,
      tokens
    );
  }, [
    market.capacity,
    market.maxPayout,
    payoutToken?.contractAddress,
    payoutToken?.decimals,
    tokens
  ]);

  return { payoutToken, quoteToken, assetValue, lockPeriod, availableAmount };
}
