import { Wallet, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { ERC20, TRADE } from '@features/swap/lib/abi';
import {
  InAmountGetterArgs,
  OutAmountGetterArgs
} from '@features/swap/types/swap';
import {
  isNativeWrapped,
  addresses,
  wrapNativeAddress,
  getTimestampDeadline,
  dexValidators,
  swapArgsCallback,
  swapPayableArgsCallback,
  wrapEstimatedGas
} from '@features/swap/utils';
import {
  createAMBProvider,
  createRouterContract
} from '@features/swap/utils/contracts/instances';

export async function getAmountsOut({
  amountToSell,
  path
}: OutAmountGetterArgs) {
  if (dexValidators.isEmptyAmount(formatEther(amountToSell))) return;

  try {
    const provider = createAMBProvider();
    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    if (isSelectedSameTokens) return [amountToSell];

    const contract = createRouterContract(provider, TRADE);
    return await contract.getAmountsOut(amountToSell, excludeNativeETH);
  } catch (error) {
    throw error;
  }
}

export async function getAmountsIn({
  amountToReceive,
  path
}: InAmountGetterArgs) {
  if (dexValidators.isEmptyAmount(formatEther(amountToReceive))) return;

  try {
    const provider = createAMBProvider();
    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    if (isSelectedSameTokens) return [amountToReceive];

    const contract = createRouterContract(provider, TRADE);
    return await contract.getAmountsIn(amountToReceive, excludeNativeETH);
  } catch (error) {
    throw error;
  }
}

export async function swapExactETHForTokens(
  amountIn: string,
  amountOut: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean,
  estimateGas: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const timestampDeadline = getTimestampDeadline(deadline);

    const args = await swapPayableArgsCallback(
      amountIn,
      amountOut,
      wrapNativeAddress(path),
      signer.address,
      timestampDeadline,
      slippageTolerance,
      tradeIn
    );

    if (estimateGas) {
      return await wrapEstimatedGas(
        routerContract,
        tradeIn ? 'swapExactAMBForTokens' : 'swapAMBForExactTokens',
        args
      );
    }

    const callSwapMethod =
      routerContract[
        tradeIn ? 'swapExactAMBForTokens' : 'swapAMBForExactTokens'
      ];

    const tx = await callSwapMethod(...args);
    return await tx.wait();
  } catch (error) {
    throw error;
  }
}

export async function swapMultiHopExactTokensForTokens(
  amountIn: string,
  amountOut: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean,
  estimateGas: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const timestampDeadline = getTimestampDeadline(deadline);

    const isFromETH = path[0] === addresses.ASC;
    const isToETH = path[path.length - 1] === addresses.ASC;

    // Determine the swap method based on path and trade direction
    const getSwapMethod = () => {
      if (isFromETH) {
        return tradeIn
          ? 'swapExactAMBForTokensSupportingFeeOnTransferTokens'
          : 'swapAMBForExactTokens';
      }
      if (isToETH) {
        return tradeIn
          ? 'swapExactTokensForAMBSupportingFeeOnTransferTokens'
          : 'swapTokensForExactAMB';
      }
      return tradeIn
        ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
        : 'swapTokensForExactTokens';
    };

    // Get arguments based on whether it's a payable transaction
    const getArgs = async () => {
      const argsCallback = isFromETH
        ? swapPayableArgsCallback
        : swapArgsCallback;
      return argsCallback(
        amountIn,
        amountOut,
        wrapNativeAddress(path),
        signer.address,
        timestampDeadline,
        slippageTolerance,
        tradeIn
      );
    };

    const swapMethod = getSwapMethod();
    const args = await getArgs();

    if (estimateGas) {
      return await wrapEstimatedGas(routerContract, swapMethod, args);
    }

    const tx = await routerContract[swapMethod](...args);
    return await tx.wait();
  } catch (error) {
    throw error;
  }
}

export async function swapExactTokensForTokens(
  amountIn: string,
  amountOut: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean,
  estimateGas: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const timestampDeadline = getTimestampDeadline(deadline);

    if (estimateGas) {
      const args = await swapArgsCallback(
        amountIn,
        amountOut,
        path,
        signer.address,
        timestampDeadline,
        slippageTolerance,
        tradeIn
      );

      return await wrapEstimatedGas(
        routerContract,
        tradeIn
          ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
          : 'swapTokensForExactTokens',
        args
      );
    }

    const callSwapMethod =
      routerContract[
        tradeIn
          ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
          : 'swapTokensForExactTokens'
      ];

    const args = await swapArgsCallback(
      amountIn,
      amountOut,
      path,
      signer.address,
      timestampDeadline,
      slippageTolerance,
      tradeIn
    );

    const tx = await callSwapMethod(...args);

    return await tx.wait();
  } catch (error) {
    throw error;
  }
}

export async function swapExactTokensForETH(
  amountIn: string,
  amountOut: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean,
  estimateGas: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const timestampDeadline = getTimestampDeadline(deadline);

    if (estimateGas) {
      const args = await swapArgsCallback(
        amountIn,
        amountOut,
        path,
        signer.address,
        timestampDeadline,
        slippageTolerance,
        tradeIn
      );

      return await wrapEstimatedGas(
        routerContract,
        tradeIn ? 'swapExactTokensForAMB' : 'swapTokensForExactAMB',
        args
      );
    }

    const args = await swapArgsCallback(
      amountIn,
      amountOut,
      path,
      signer.address,
      timestampDeadline,
      slippageTolerance,
      tradeIn
    );

    const callSwapMethod =
      routerContract[
        tradeIn
          ? 'swapExactTokensForAMBSupportingFeeOnTransferTokens'
          : 'swapTokensForExactAMB'
      ];

    const tx = await callSwapMethod(...args);

    return await tx.wait();
  } catch (error) {
    throw error;
  }
}

export async function wrapETH(
  amountToSell: string,
  signer: Wallet,
  { estimateGas }: { estimateGas?: boolean }
) {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const contract = new ethers.Contract(addresses.SAMB, ERC20);

  const signedContract = contract.connect(signer);

  if (estimateGas) {
    return await wrapEstimatedGas(signedContract, 'deposit', [
      { value: bnAmountToSell }
    ]);
  }

  const { wait } = await signedContract.deposit({ value: bnAmountToSell });

  return await wait();
}

export async function unwrapETH(
  amountToSell: string,
  signer: Wallet,
  { estimateGas }: { estimateGas?: boolean }
) {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const contract = new ethers.Contract(addresses.SAMB, ERC20);

  const signedContract = contract.connect(signer);

  if (estimateGas) {
    return await wrapEstimatedGas(signedContract, 'withdraw', [bnAmountToSell]);
  }

  const { wait } = await signedContract.withdraw(bnAmountToSell);

  return await wait();
}
