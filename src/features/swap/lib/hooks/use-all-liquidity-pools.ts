import { useCallback, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import { ERC20_PAIR } from '../abi';
import {
  createAMBProvider,
  createFactoryContract
} from '@features/swap/utils/contracts/instances';
import { SelectedTokensState } from '@features/swap/types';
import { useSwapContextSelector } from '@features/swap/context';
import { wrapNativeAddress } from '@features/swap/utils';
import { useSwapActions } from './use-swap-actions';

export function useAllLiquidityPools() {
  const {
    setPairs,
    allPairsRef,
    selectedTokens,
    latestSelectedTokensAmount,
    isExactInRef
  } = useSwapContextSelector();
  const { hasWrapNativeToken } = useSwapActions();

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
      if (TOKEN_A && TOKEN_B) {
        const [addressFrom, addressTo] = wrapNativeAddress([
          TOKEN_A?.address ?? '',
          TOKEN_B?.address ?? ''
        ]);

        const targetSet = new Set([addressFrom, addressTo]);

        return allPairsRef.current.find((pair) => {
          const pairSet = new Set([pair.token0, pair.token1]);
          return (
            targetSet.size === pairSet.size &&
            [...targetSet].every((value) => pairSet.has(value))
          );
        });
      }
    },
    [allPairsRef]
  );

  const getReserves = useCallback(
    async (pairAddress: string, selectedTokens: SelectedTokensState) => {
      const mapper = getPairAddress(selectedTokens);
      const pair = new ethers.Contract(
        pairAddress,
        ERC20_PAIR,
        createAMBProvider()
      );
      const reserves = await pair.getReserves();

      const { TOKEN_A, TOKEN_B } = selectedTokens;

      const [addressFrom, addressTo] = wrapNativeAddress([
        TOKEN_A?.address ?? '',
        TOKEN_B?.address ?? ''
      ]);

      // Determine if the token order in the pair matches TOKEN_A and TOKEN_B
      const isTokenAFirst =
        mapper?.token0 === addressFrom && mapper?.token1 === addressTo;

      const reserveIn = isTokenAFirst ? reserves[0] : reserves[1];
      const reserveOut = isTokenAFirst ? reserves[1] : reserves[0];

      return { reserveIn, reserveOut };
    },
    [getPairAddress]
  );

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

  const uiGetterPriceImpact = useCallback(async () => {
    if (!hasWrapNativeToken) {
      const pool = getPairAddress(selectedTokens);

      if (pool && pool.pairAddress) {
        const { reserveIn, reserveOut } = await getReserves(
          pool.pairAddress,
          selectedTokens
        );

        const { TOKEN_A, TOKEN_B } = latestSelectedTokensAmount.current;
        if (reserveIn && reserveOut) {
          const [executeReserveIn, executeReserveOut] = isExactInRef.current
            ? [reserveIn, reserveOut]
            : [reserveOut, reserveIn];

          const amountToSell = isExactInRef.current ? TOKEN_A : TOKEN_B;
          const amountToReceive = isExactInRef.current ? TOKEN_B : TOKEN_A;

          const bnAmountOut = ethers.utils.parseUnits(amountToReceive);

          return calculatePriceImpact(
            amountToSell,
            bnAmountOut,
            executeReserveIn,
            executeReserveOut
          );
        }
      }
    }
  }, [
    getPairAddress,
    getReserves,
    hasWrapNativeToken,
    isExactInRef,
    latestSelectedTokensAmount,
    selectedTokens
  ]);

  useEffect(() => {
    getAllPoolsCount();
  }, [getAllPoolsCount]);

  return {
    getPairAddress,
    getReserves,
    calculatePriceImpact,
    uiGetterPriceImpact
  };
}
