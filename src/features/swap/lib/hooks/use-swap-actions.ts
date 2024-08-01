import { useCallback } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import {
  checkIsApprovalRequired,
  getAmountsIn,
  getAmountsOut,
  increaseAllowance,
  swapExactETHForTokens,
  swapExactTokensForETH,
  swapExactTokensForTokens,
  swapMultiHopExactTokensForTokens,
  unwrapETH,
  wrapETH
} from '../contracts';
import { useBridgeContextData } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';
import {
  wrapNativeAddress,
  isETHtoWrapped,
  isWrappedToETH,
  isMultiHopSwapAvaliable,
  extractArrayOfMiddleMultiHopAddresses,
  addresses
} from '@features/swap/utils';
import { createSigner } from '@features/swap/utils/contracts/instances';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';
import { useSwapHelpers } from './use-swap-helpers';
import { getObjectKeyByValue } from '@utils/object';

export function useSwapActions() {
  const { selectedAccount } = useBridgeContextData();
  const {
    isExactInRef,
    uiBottomSheetInformation,
    setUiBottomSheetInformation,
    setIsMultiHopSwapCurrencyBetter
  } = useSwapContextSelector();

  const { settings } = useSwapSettings();
  const { tokensRoute, tokenToSell } = useSwapTokens();
  const { _privateKeyGetter, isStartsWithETH, isEndsWithETH } =
    useSwapHelpers();

  const checkAllowance = useCallback(async () => {
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther(tokenToSell.AMOUNT);

      return checkIsApprovalRequired({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: tokenToSell.TOKEN?.address ?? '',
        privateKey,
        amount: bnAmountToSell
      });
    } catch (error) {
      throw error;
    }
  }, [selectedAccount?._raw, tokenToSell.AMOUNT, tokenToSell.TOKEN?.address]);

  const setAllowance = useCallback(async () => {
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther('1000000');

      const allowance = await increaseAllowance({
        address: tokenToSell.TOKEN?.address ?? '',
        privateKey,
        amount: bnAmountToSell
      });

      const response = await allowance.wait();

      if (response) {
        checkAllowance();
        setUiBottomSheetInformation({
          ...uiBottomSheetInformation,
          allowance: 'increased'
        });
      }
    } catch (error) {
      throw error;
    }
  }, [
    checkAllowance,
    selectedAccount?._raw,
    setUiBottomSheetInformation,
    tokenToSell.TOKEN?.address,
    uiBottomSheetInformation
  ]);

  const getTokenAmountOut = useCallback(
    async (amountToSell: string, path: string[]) => {
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);
      const prices = await getAmountsOut({
        path,
        amountToSell: bnAmountToSell
      });

      return prices[prices.length - 1];
    },
    []
  );

  const getTokenAmountIn = useCallback(
    async (amountToReceive: string, path: string[]) => {
      const bnAmountToReceive = ethers.utils.parseEther(amountToReceive);
      const prices = await getAmountsIn({
        path,
        amountToReceive: bnAmountToReceive
      });

      return prices[0];
    },
    []
  );

  const getTokenAmountOutWithMultiRoute = useCallback(
    async (amountToSell: string, path: string[], middleAddress: string) => {
      const [addressFrom, addressTo] = path;
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      const prices = await getAmountsOut({
        path: [addressFrom, middleAddress, addressTo],
        amountToSell: bnAmountToSell
      });

      return prices[prices.length - 1];
    },
    []
  );

  const getTokenAmountInWithMultiRoute = useCallback(
    async (amountToSell: string, path: string[], middleAddress: string) => {
      const [addressFrom, addressTo] = path;
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      const prices = await getAmountsIn({
        path: [addressFrom, middleAddress, addressTo],
        amountToReceive: bnAmountToSell
      });

      return prices[0];
    },
    []
  );

  const resetMultiHopUiState = useCallback(() => {
    return setIsMultiHopSwapCurrencyBetter({
      state: false,
      token: ''
    });
  }, [setIsMultiHopSwapCurrencyBetter]);

  const onChangeMultiHopUiState = useCallback(
    (plate = false, middleHopAddress: string) => {
      if (!plate) {
        setIsMultiHopSwapCurrencyBetter({
          state: true,
          token: getObjectKeyByValue(addresses, middleHopAddress) ?? ''
        });
      }
    },
    [setIsMultiHopSwapCurrencyBetter]
  );

  const getOppositeReceivedTokenAmount = useCallback(
    async (amountToSell: string, path: string[], plate = false) => {
      if (amountToSell === '' || amountToSell === '0')
        return BigNumber.from('0');

      const isMultiHopRouteSupported = isMultiHopSwapAvaliable(path);
      const middleHopAddress = extractArrayOfMiddleMultiHopAddresses(path);
      const { multihops } = settings.current;
      const tradeIn = isExactInRef.current;

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let multiHopAmount: BigNumber = BigNumber.from('0');

      try {
        if (tradeIn) {
          singleHopAmount = await getTokenAmountOut(amountToSell, path);
        } else {
          singleHopAmount = await getTokenAmountIn(amountToSell, path);
        }
      } catch (error) {
        console.error('Error fetching single-hop amount:', error);
      }

      if (!isMultiHopRouteSupported || !multihops) {
        return singleHopAmount;
      }

      // Calculate multi-hop amount
      try {
        const middleHopAddress = extractArrayOfMiddleMultiHopAddresses(path);
        if (tradeIn) {
          multiHopAmount = await getTokenAmountOutWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        } else {
          multiHopAmount = await getTokenAmountInWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        }
      } catch (error) {
        resetMultiHopUiState();
        if (tradeIn) {
          return await getTokenAmountOut(amountToSell, path);
        } else {
          return await getTokenAmountIn(amountToSell, path);
        }
      }

      // Compare and return the best rate based on tradeIn
      if (tradeIn) {
        if (multiHopAmount.gt(singleHopAmount)) {
          onChangeMultiHopUiState(plate, middleHopAddress.address);
        } else {
          resetMultiHopUiState();
        }
        return singleHopAmount.gt(multiHopAmount)
          ? singleHopAmount
          : multiHopAmount;
      } else {
        if (multiHopAmount.lt(singleHopAmount)) {
          onChangeMultiHopUiState(plate, middleHopAddress.address);
        } else {
          resetMultiHopUiState();
        }
        return singleHopAmount.lt(multiHopAmount)
          ? singleHopAmount
          : multiHopAmount;
      }
    },
    [
      getTokenAmountIn,
      getTokenAmountInWithMultiRoute,
      getTokenAmountOut,
      getTokenAmountOutWithMultiRoute,
      isExactInRef,
      onChangeMultiHopUiState,
      resetMultiHopUiState,
      settings
    ]
  );

  const swapTokens = useCallback(async () => {
    const signer = createSigner(await _privateKeyGetter());
    const excludeNativeETH = wrapNativeAddress(tokensRoute);
    const isMultiHopPathAvailable = isMultiHopSwapAvaliable(excludeNativeETH);

    const { slippageTolerance, deadline, multihops } = settings.current;

    if (isETHtoWrapped(tokensRoute)) {
      return await wrapETH(tokenToSell.AMOUNT, signer);
    }

    if (isWrappedToETH(tokensRoute)) {
      return await unwrapETH(tokenToSell.AMOUNT, signer);
    }

    if (isStartsWithETH && !isMultiHopPathAvailable && !multihops) {
      return await swapExactETHForTokens(
        tokenToSell.AMOUNT,
        excludeNativeETH,
        signer,
        slippageTolerance,
        deadline
      );
    }

    if (isEndsWithETH) {
      return await swapExactTokensForETH(
        tokenToSell.AMOUNT,
        excludeNativeETH,
        signer,
        slippageTolerance,
        deadline
      );
    }

    if (multihops && isMultiHopPathAvailable) {
      return await swapMultiHopExactTokensForTokens(
        tokenToSell.AMOUNT,
        tokensRoute,
        signer,
        slippageTolerance,
        deadline
      );
    }

    return await swapExactTokensForTokens(
      tokenToSell.AMOUNT,
      tokensRoute,
      signer,
      slippageTolerance,
      deadline
    );
  }, [
    _privateKeyGetter,
    isEndsWithETH,
    isStartsWithETH,
    settings,
    tokenToSell.AMOUNT,
    tokensRoute
  ]);

  return {
    checkAllowance,
    setAllowance,
    getOppositeReceivedTokenAmount,
    getTokenAmountOut,
    swapTokens
  };
}
