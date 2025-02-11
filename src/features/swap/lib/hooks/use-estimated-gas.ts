import { useCallback } from 'react';
import { ethers } from 'ethers';
import { bnZERO } from '@constants/variables';
import { useWalletPrivateKey } from '@entities/wallet';
import {
  calculateAllowanceWithProviderFee,
  calculateGasMargin
} from '@features/swap/utils';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';
import { useSwapActions } from './use-swap-actions';
import { useSwapTokens } from './use-swap-tokens';
import { checkIsApprovalRequired, increaseAllowance } from '../contracts';

type BaseEstimatedGasArgs = {
  amountIn?: string;
  amountOut?: string;
};

export function useEstimatedGas() {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { tokenToSell } = useSwapTokens();
  const { swapCallback } = useSwapActions();

  const baseProviderFee = useCallback(
    async (estimatedGas: ethers.BigNumber) => {
      const provider = createAMBProvider();
      try {
        const { gasPrice } = await provider.getFeeData();

        const gasWithMargin = calculateGasMargin(estimatedGas);

        const gasPriceNumber = gasPrice ? gasPrice.toNumber() : 0;
        const estimatedGasNumber = gasWithMargin.toNumber();

        const totalWei = Math.floor(
          estimatedGasNumber * gasPriceNumber
        ).toString();
        const result = ethers.utils.parseUnits(totalWei, 'wei');

        return result;
      } catch (error) {
        return ethers.BigNumber.from(0);
      }
    },
    []
  );

  const isEnoughBalanceToCoverGas = useCallback(async () => {
    return true;
  }, []);

  const estimatedSwapGas = useCallback(
    async (args?: BaseEstimatedGasArgs) => {
      return await swapCallback({ ...args, estimateGas: true });
    },
    [swapCallback]
  );

  const estimatedApprovalGas = useCallback(
    async (args?: Pick<BaseEstimatedGasArgs, 'amountIn'>) => {
      const { amountIn } = args ?? {};
      const privateKey = await _extractPrivateKey();

      const amountWithFee = calculateAllowanceWithProviderFee(
        amountIn || tokenToSell.AMOUNT
      );

      const bnAmountToSell = ethers.utils.parseEther(amountWithFee);

      const hasIncreaseAllowance = await checkIsApprovalRequired({
        address: tokenToSell.TOKEN?.address ?? '',
        privateKey,
        amount: bnAmountToSell
      });

      if (hasIncreaseAllowance) {
        const estimatedGas = await increaseAllowance({
          address: tokenToSell.TOKEN?.address ?? '',
          privateKey,
          amount: bnAmountToSell,
          estimateGas: true
        });

        return await baseProviderFee(estimatedGas);
      }

      return bnZERO;
    },
    [
      _extractPrivateKey,
      baseProviderFee,
      tokenToSell.AMOUNT,
      tokenToSell.TOKEN?.address
    ]
  );

  return {
    estimatedSwapGas,
    estimatedApprovalGas,
    isEnoughBalanceToCoverGas
  };
}
