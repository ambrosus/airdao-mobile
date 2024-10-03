import { useCallback, useEffect, useState } from 'react';
import { BigNumber, ethers, utils } from 'ethers';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { formatDecimals } from '@features/kosmos/utils';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from './use-market-details';
import { useMarketTokens } from './use-market-tokens';
import { useERC20Balance, useWallet } from '@hooks';

export function useBalance(market: MarketType | undefined) {
  const { wallet } = useWallet();
  const { bnBalance, setBnBalance, setIsBalanceFetching, onChangeAmountToBuy } =
    useKosmosMarketsContextSelector();
  const { tokens } = useMarketTokens();
  const { willGetWithArguments, quoteToken } = useMarketDetails(market);

  const [tokenBalance, setTokenBalance] = useState('');

  const { refetch: refetchERC20Balance, isFetching } = useERC20Balance(
    quoteToken?.contractAddress ?? ''
  );

  const balanceSetter = useCallback(
    (value: BigNumber | undefined) => {
      if (!value) return;
      setTokenBalance(ethers.utils.formatEther(value?._hex));
      setBnBalance(value);
    },
    [setBnBalance]
  );
  useEffect(() => {
    if (quoteToken && wallet) {
      refetchERC20Balance().then((r) => {
        balanceSetter(r?.data);
      });
    }
  }, [balanceSetter, quoteToken, refetchERC20Balance, wallet]);

  const fetchBondBalance = useCallback(async () => {
    if (!quoteToken || !wallet?.address) return;

    try {
      const balance = await refetchERC20Balance();
      if (balance.data) {
        balanceSetter(balance.data);
      }
    } catch (error) {
      throw error;
    }
  }, [balanceSetter, quoteToken, refetchERC20Balance, wallet?.address]);

  const refetchTokenBalance = useCallback(async () => {
    setIsBalanceFetching(true);
    await fetchBondBalance();
    setIsBalanceFetching(false);
  }, [fetchBondBalance, setIsBalanceFetching]);

  useEffect(() => {
    if (!quoteToken || tokenBalance !== '' || bnBalance) return;

    fetchBondBalance().then();
  }, [bnBalance, fetchBondBalance, quoteToken, tokenBalance, wallet]);

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
      bnBalance,
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
    calculateMaximumAvailableAmount,
    tokenBalance,
    refetchTokenBalance,
    isFetching
  };
}
