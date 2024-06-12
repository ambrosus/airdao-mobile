import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { checkIsApprovalRequired, increaseAllowance } from '../contracts';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';

export function useSwapActions() {
  const { selectedAccount } = useBridgeContextSelector();
  const { selectedTokensAmount, selectedTokens } = useSwapContextSelector();

  const [isProcessingAllowance, setIsProcessingAllowance] = useState(false);

  const checkAllowance = useCallback(async () => {
    setIsProcessingAllowance(true);
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther(
        selectedTokensAmount.TOKEN_A
      );

      return checkIsApprovalRequired({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: selectedTokens.TOKEN_A!.address,
        privateKey,
        amount: bnAmountToSell
      });
    } catch (error) {
      throw error;
    } finally {
      setIsProcessingAllowance(false);
    }
  }, [selectedAccount, selectedTokens.TOKEN_A, selectedTokensAmount.TOKEN_A]);

  const setAllowance = useCallback(async () => {
    setIsProcessingAllowance(true);
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther(
        selectedTokensAmount.TOKEN_A
      );

      const allowance = await increaseAllowance({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: selectedTokens.TOKEN_A!.address,
        privateKey,
        amount: bnAmountToSell
      });

      const response = await allowance.wait();

      if (response) {
        checkAllowance();
      }
    } catch (error) {
      throw error;
    } finally {
      setIsProcessingAllowance(false);
    }
  }, [
    checkAllowance,
    selectedAccount,
    selectedTokens.TOKEN_A,
    selectedTokensAmount.TOKEN_A
  ]);

  return { checkAllowance, setAllowance, isProcessingAllowance };
}
