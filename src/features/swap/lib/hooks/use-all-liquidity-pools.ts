import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { PAIR } from '@features/swap/lib/abi';
import { SelectedTokensState } from '@features/swap/types';
import { wrapNativeAddress } from '@features/swap/utils';
import {
  createAMBProvider,
  createFactoryContract
} from '@features/swap/utils/contracts/instances';

export function useAllLiquidityPools() {
  const { setPairs, allPairsRef } = useSwapContextSelector();

  const getAllPoolsCount = useCallback(async () => {
    try {
      const contract = createFactoryContract();
      const pairCount = await contract.allPairsLength();

      const pairPromises = Array.from(
        { length: Number(pairCount) },
        async (_, i) => {
          const pairAddress = await contract.allPairs(i);
          const pairContract = new ethers.Contract(
            pairAddress,
            PAIR,
            createAMBProvider()
          );

          const [token0, token1] = await Promise.all([
            pairContract.token0(),
            pairContract.token1()
          ]);

          return {
            pairAddress,
            token0,
            token1
          };
        }
      );

      const results = await Promise.all(pairPromises);

      setPairs(results);

      return results;
    } catch (error) {
      console.error('Error fetching liquidity pools:', error);
      setPairs([]);
      return [];
    }
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
      const pair = new ethers.Contract(pairAddress, PAIR, createAMBProvider());
      const reserves = await pair.getReserves();

      const { TOKEN_A, TOKEN_B } = selectedTokens;

      const [addressFrom, addressTo] = wrapNativeAddress([
        TOKEN_A?.address ?? '',
        TOKEN_B?.address ?? ''
      ]);

      const isTokenAFirst =
        mapper?.token0 === addressFrom && mapper?.token1 === addressTo;

      const reserveIn = isTokenAFirst ? reserves[0] : reserves[1];
      const reserveOut = isTokenAFirst ? reserves[1] : reserves[0];

      return { reserveIn, reserveOut };
    },
    [getPairAddress]
  );

  return {
    getAllPoolsCount,
    getPairAddress,
    getReserves
  };
}
