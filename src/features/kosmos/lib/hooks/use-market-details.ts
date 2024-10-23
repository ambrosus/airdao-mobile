import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { MarketType } from '@features/kosmos/types';
import { useExtractToken } from './use-extract-token';
import {
  MAINNET_VESTINGS,
  TESTNET_VESTINGS
} from '@features/kosmos/utils/vestings';
import Config from '@constants/config';
import { formatDecimals } from '@features/kosmos/utils';
import { getProtocolFee } from '@features/kosmos/api';
import { _willGet, _willGetSubFee } from '@features/kosmos/utils/transaction';

export function useMarketDetails(market: MarketType | undefined) {
  const { tokens, amountToBuy } = useKosmosMarketsContextSelector();
  const { extractTokenCb } = useExtractToken();
  const payoutToken = extractTokenCb(market?.payoutToken ?? '');
  const quoteToken = extractTokenCb(market?.quoteToken ?? '');

  const [protocolFee, setProtocolFee] = useState(0);

  useEffect(() => {
    getProtocolFee().then((response) => setProtocolFee(response));
  }, []);

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
    if (!market?.vesting) return null;

    const vestings =
      Config.env === 'testnet' ? TESTNET_VESTINGS : MAINNET_VESTINGS;

    return vestings.find((el) => el.value === +market.vesting)?.label;
  }, [market?.vesting]);

  const availableAmount = useMemo(() => {
    if (!market?.maxPayout) return null;

    return formatDecimals(
      utils.formatUnits(market.capacity, payoutToken?.decimals),
      payoutToken?.contractAddress,
      tokens
    );
  }, [
    market?.capacity,
    market?.maxPayout,
    payoutToken?.contractAddress,
    payoutToken?.decimals,
    tokens
  ]);

  const maxBondable = useMemo(() => {
    if (!market?.maxPayout) return '';

    return formatDecimals(
      utils.formatUnits(market.maxPayout, payoutToken?.decimals),
      payoutToken?.contractAddress,
      tokens
    );
  }, [
    market?.maxPayout,
    payoutToken?.contractAddress,
    payoutToken?.decimals,
    tokens
  ]);

  const discount = useMemo(() => {
    return market?.discount ? market.discount.toFixed(2) + '%' : '-';
  }, [market?.discount]);

  const slippage = useMemo(() => {
    return market?.marketType === 'SDA' ? +amountToBuy * 0.0001 : 0;
  }, [amountToBuy, market?.marketType]);

  const willGetSubFee = useMemo(() => {
    return _willGetSubFee(
      amountToBuy,
      protocolFee,
      slippage,
      market?.bondMarketPrice ?? 0
    );
  }, [amountToBuy, market?.bondMarketPrice, protocolFee, slippage]);

  const willGet = useMemo(() => {
    return _willGet(amountToBuy, market?.bondMarketPrice ?? 0);
  }, [amountToBuy, market?.bondMarketPrice]);

  const willGetWithArguments = useCallback(
    (amount: string) => {
      return _willGet(amount, market?.bondMarketPrice ?? 0);
    },
    [market?.bondMarketPrice]
  );

  return {
    payoutToken,
    quoteToken,
    assetValue,
    lockPeriod,
    availableAmount,
    maxBondable,
    discount,
    protocolFee,
    willGet,
    willGetSubFee,
    willGetWithArguments
  };
}
