import { useCallback } from 'react';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { API } from '@api/api';
import { CryptoCurrencyCode } from '@appTypes';
import { AMB_DECIMALS, bnZERO } from '@constants/variables';
import { useWalletPrivateKey, useWalletStore } from '@entities/wallet';
import { useSwapContextSelector } from '@features/swap/context';
import {
  calculateAllowanceWithProviderFee,
  calculateGasMargin
} from '@features/swap/utils';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';
import { Token } from '@models/Token';
import { TokenUtils } from '@utils';
import { useSwapActions } from './use-swap-actions';
import { useSwapTokens } from './use-swap-tokens';
import { checkIsApprovalRequired, increaseAllowance } from '../contracts';

type BaseEstimatedGasArgs = {
  amountIn?: string;
  amountOut?: string;
};

const createAMBInstance = async (address: string) => {
  const tokenBalance = await API.cryptoService.getBalanceOfAddress(address);

  return new Token(
    {
      name: 'AirDAO',
      address: address ?? '',
      isNativeCoin: true,
      balance: {
        wei: tokenBalance.wei,
        ether: Number(tokenBalance.ether) || 0,
        formattedBalance: formatUnits(tokenBalance.wei, AMB_DECIMALS)
      },
      symbol: CryptoCurrencyCode.ASC,
      decimals: AMB_DECIMALS,
      tokenNameFromDatabase: 'AirDAO'
    },
    TokenUtils
  );
};

export function useEstimatedGas() {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { wallet } = useWalletStore();
  const { tokenToSell } = useSwapTokens();
  const { swapCallback } = useSwapActions();
  const { setIsInsufficientBalance } = useSwapContextSelector();

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

  const isEnoughBalanceToCoverGas = useCallback(
    async (gasValue: ethers.BigNumber) => {
      setIsInsufficientBalance(false);

      const { balance } = await createAMBInstance(wallet?.address ?? '');

      const parsedBalance = ethers.utils.parseEther(
        balance.formattedBalance ?? '0'
      );

      setIsInsufficientBalance(parsedBalance.lt(gasValue));
    },
    [setIsInsufficientBalance, wallet?.address]
  );

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
