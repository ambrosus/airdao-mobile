import { ethers } from 'ethers';
import { minimumAmountOut, maximumAmountIn } from './prices';

export async function swapArgsCallback(
  amountIn: string,
  amountOut: string,
  path: string[],
  address: string,
  timestamp: number,
  slippageTolerance: number,
  tradeIn: boolean
) {
  const bnAmountIn = ethers.utils.parseEther(amountIn);
  const bnAmountOut = ethers.utils.parseEther(amountOut);

  const amountOutMin = minimumAmountOut(`${slippageTolerance}%`, bnAmountOut);
  const amountOutMax = maximumAmountIn(`${slippageTolerance}%`, bnAmountIn);

  return [
    tradeIn ? bnAmountIn : bnAmountOut,
    tradeIn ? amountOutMin : amountOutMax,
    path,
    address,
    timestamp
  ];
}

export async function swapPayableArgsCallback(
  amountIn: string,
  amountOut: string,
  path: string[],
  address: string,
  timestamp: number,
  slippageTolerance: number,
  tradeIn: boolean
) {
  const bnAmountIn = ethers.utils.parseEther(amountIn);
  const bnAmountOut = ethers.utils.parseEther(amountOut);

  const amountOutMin = minimumAmountOut(`${slippageTolerance}%`, bnAmountOut);
  const amountInMax = maximumAmountIn(`${slippageTolerance}%`, bnAmountIn);

  if (tradeIn) {
    return [amountOutMin, path, address, timestamp, { value: bnAmountIn }];
  } else {
    return [bnAmountOut, path, address, timestamp, { value: amountInMax }];
  }
}
