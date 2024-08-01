import { useCallback } from 'react';
import { ethers } from 'ethers';
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
import { useBridgeContextData } from '@features/bridge/context';
import { Cache, CacheKey } from '@lib/cache';
import {
  wrapNativeAddress,
  isETHtoWrapped,
  isWrappedToETH,
  extractMiddleAddressMultiHop,
  isMultiHopSwapAvaliable
} from '@features/swap/utils';
import { createSigner } from '@features/swap/utils/contracts/instances';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';
import { useSwapHelpers } from './use-swap-helpers';

export function useSwapActions() {
  const { selectedAccount } = useBridgeContextData();
  const {
    isExactInRef,
    uiBottomSheetInformation,
    setUiBottomSheetInformation
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      return getAmountsOut({
        path,
        amountToSell: bnAmountToSell
      });
    },
    []
  );

  const getTokenAmountIn = useCallback(
    async (amountToReceive: string, path: string[]) => {
      const bnAmountToReceive = ethers.utils.parseEther(amountToReceive);
      return getAmountsIn({
        path,
        amountToReceive: bnAmountToReceive
      });
    },
    []
  );

  const getTokenAmountOutWithMultiRoute = useCallback(
    async (amountToSell: string, path: string[]) => {
      const [addressFrom, addressTo] = path;

      const bnAmountToSell = ethers.utils.parseEther(amountToSell);
      const middleAddress = extractMiddleAddressMultiHop(path);

      const intermediatePath = [addressFrom, middleAddress];
      const finalPath = [middleAddress, addressTo];

      const intermediateAmount = await getAmountsOut({
        path: intermediatePath,
        amountToSell: bnAmountToSell
      });

      return await getAmountsOut({
        path: finalPath,
        amountToSell: intermediateAmount
      });
    },
    []
  );

  const getTokenAmountInWithMultiRoute = useCallback(
    async (amountToSell: string, path: string[]) => {
      const [addressFrom, addressTo] = path;

      const bnAmountToSell = ethers.utils.parseEther(amountToSell);
      const middleAddress = extractMiddleAddressMultiHop(path);

      const intermediatePath = [addressFrom, middleAddress];
      const finalPath = [middleAddress, addressTo];

      const intermediateAmount = await getAmountsIn({
        path: intermediatePath,
        amountToReceive: bnAmountToSell
      });

      return await getAmountsIn({
        path: finalPath,
        amountToReceive: intermediateAmount
      });
    },
    []
  );

  const getOppositeReceivedTokenAmount = useCallback(
    async (amountToSell: string, path: string[], reversed?: boolean) => {
      if (amountToSell === '' || amountToSell === '0') return;
      const route = reversed ? path.reverse() : path;
      const isMultiHopPathAvailable = isMultiHopSwapAvaliable(route);

      if (
        isExactInRef.current &&
        settings.current.multihops &&
        isMultiHopPathAvailable
      ) {
        return await getTokenAmountOutWithMultiRoute(amountToSell, path);
      } else if (
        !isExactInRef.current &&
        settings.current.multihops &&
        isMultiHopPathAvailable
      ) {
        return await getTokenAmountInWithMultiRoute(amountToSell, path);
      } else if (!isExactInRef.current) {
        return await getTokenAmountIn(amountToSell, path);
      }

      return await getTokenAmountOut(amountToSell, path);
    },
    [
      getTokenAmountIn,
      getTokenAmountInWithMultiRoute,
      getTokenAmountOut,
      getTokenAmountOutWithMultiRoute,
      isExactInRef,
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

    if (isStartsWithETH) {
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
