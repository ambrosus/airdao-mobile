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
  swapPayableArgsCallback
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
  tradeIn: boolean
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

    const callSwapMethod =
      routerContract[
        tradeIn
          ? 'swapExactAMBForTokensSupportingFeeOnTransferTokens'
          : 'swapAMBForExactTokens'
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
  tradeIn: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);

    const timestampDeadline = getTimestampDeadline(deadline);

    const isFromETH = path[0] === addresses.AMB;
    const isToETH = path[path.length - 1] === addresses.AMB;

    let tx;

    if (isFromETH) {
      const args = await swapPayableArgsCallback(
        amountIn,
        amountOut,
        wrapNativeAddress(path),
        signer.address,
        timestampDeadline,
        slippageTolerance,
        tradeIn
      );

      const callSwapMethod =
        routerContract[
          tradeIn
            ? 'swapExactAMBForTokensSupportingFeeOnTransferTokens'
            : 'swapAMBForExactTokens'
        ];

      tx = await callSwapMethod(...args);
    } else if (isToETH) {
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

      tx = await callSwapMethod(...args);
    } else {
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

      tx = await callSwapMethod(...args);
    }

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
  tradeIn: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const timestampDeadline = getTimestampDeadline(deadline);

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
  tradeIn: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const timestampDeadline = getTimestampDeadline(deadline);

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

export async function wrapETH(amountToSell: string, signer: Wallet) {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const contract = new ethers.Contract(addresses.SAMB, ERC20);

  const signedContract = contract.connect(signer);
  const tx = await signedContract.deposit({ value: bnAmountToSell });

  return await tx.wait();
}

export async function unwrapETH(amountToSell: string, signer: Wallet) {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const contract = new ethers.Contract(addresses.SAMB, ERC20);

  const signedContract = contract.connect(signer);
  const tx = await signedContract.withdraw(bnAmountToSell);

  return await tx.wait();
}
