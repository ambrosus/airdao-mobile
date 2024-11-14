import { useCallback } from 'react';
import { BigNumber, ethers, utils } from 'ethers';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { formatDecimals } from '@features/kosmos/utils';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from './use-market-details';
import { useMarketTokens } from './use-market-tokens';

export function useBalance(market: MarketType | undefined) {
  const { onChangeAmountToBuy } = useKosmosMarketsContextSelector();
  const { tokens } = useMarketTokens();
  const { willGetWithArguments, quoteToken } = useMarketDetails(market);

  const calculateNewAmount = useCallback(
    (amount: ethers.BigNumber) => {
      const wg = willGetWithArguments('1') ?? ethers.BigNumber.from('1');
      const result = amount.mul(BigNumber.from(10).pow(18)).div(wg);
      return (
        Math.floor(+utils.formatUnits(result, 18) * 1000000) / 1000000
      ).toString();
    },
    [willGetWithArguments]
  );

  const calculateMaximumAvailableAmount = useCallback(
    (balance: string) => {
      const maxPayout = BigNumber.from(market?.maxPayout);
      const availableAmount = BigNumber.from(market?.capacity);
      const bnBalance = ethers.utils.parseUnits(balance);

      let newAmount;
      if (bnBalance?.gt(availableAmount) && maxPayout.gt(availableAmount)) {
        newAmount = calculateNewAmount(availableAmount);
      } else if (willGetWithArguments(balance)?.gt(maxPayout)) {
        newAmount = calculateNewAmount(maxPayout);
      } else {
        newAmount = balance;
      }

      onChangeAmountToBuy(
        formatDecimals(
          newAmount,
          quoteToken?.contractAddress,
          tokens
        ).toString()
      );
    },
    [
      calculateNewAmount,
      market?.capacity,
      market?.maxPayout,
      onChangeAmountToBuy,
      quoteToken?.contractAddress,
      tokens,
      willGetWithArguments
    ]
  );
  return {
    calculateMaximumAvailableAmount
  };
}
