import { BigNumber, ethers } from 'ethers';
import { ERC20_PAIR } from '../abi';
import {
  createAMBProvider,
  createFactoryContract
} from '@features/swap/utils/contracts/instances';
import { useCallback, useEffect } from 'react';
import { SelectedTokensState } from '@features/swap/types';
import { useSwapContextSelector } from '@features/swap/context';

export function useAllLiquidityPools() {
  const { setPairs, allPairsRef } = useSwapContextSelector();
  const getAllPoolsCount = useCallback(async () => {
    const pairs = [];
    const contract = createFactoryContract();
    const pairCount = await contract.allPairsLength();

    for (let i = 0; i < pairCount; i++) {
      const pairAddress = await contract.allPairs(i);
      const pairContract = new ethers.Contract(
        pairAddress,
        ERC20_PAIR,
        createAMBProvider()
      );
      const token0 = await pairContract.token0();
      const token1 = await pairContract.token1();

      pairs.push({
        pairAddress,
        token0,
        token1
      });
    }
    if (pairs.length > 0) setPairs(pairs);
  }, [setPairs]);

  const getPairAddress = useCallback(
    (selectedTokens: SelectedTokensState) => {
      const { TOKEN_A, TOKEN_B } = selectedTokens;
      return allPairsRef.current.find((pair) => {
        return (
          pair.token0 === TOKEN_A?.address && pair.token1 === TOKEN_B?.address
        );
      });
    },
    [allPairsRef]
  );

  const getReserves = async (pairAddress: string) => {
    const pair = new ethers.Contract(
      pairAddress,
      ERC20_PAIR,
      createAMBProvider()
    );
    const reserves = await pair.getReserves();
    const reserveIn = reserves[0];
    const reserveOut = reserves[1];

    return { reserveIn, reserveOut };
  };

  const calculatePriceImpact = (
    amountIn: string,
    amountOut: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber
  ): string => {
    // @ts-ignore
    const initialPrice = reserveOut / reserveIn;
    const newReserveIn = reserveIn.add(amountIn);
    const newReserveOut = reserveOut.sub(amountOut);
    // @ts-ignore
    const newPrice = newReserveOut / newReserveIn;
    const priceImpact = ((newPrice - initialPrice) / initialPrice) * 100;
    return String(-priceImpact.toFixed(2));
  };

  useEffect(() => {
    getAllPoolsCount();
  }, [getAllPoolsCount]);

  return {
    getPairAddress,
    getReserves,
    calculatePriceImpact
  };
}
