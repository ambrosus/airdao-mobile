import { ethers } from 'ethers';

export function minimumAmountOut(
  slippageToleranceStr: string,
  amountToReceive: ethers.BigNumber
) {
  const slippageTolerance =
    parseFloat(slippageToleranceStr.replace('%', '')) / 100;

  const slippageBasisPoints = Math.floor(slippageTolerance * 10000);

  const slippageAdjustedAmountOut = amountToReceive
    .mul(ethers.BigNumber.from(10000 - slippageBasisPoints))
    .div(10000);

  return slippageAdjustedAmountOut;
}

export function maximumAmountOut(
  slippageToleranceStr: string,
  amountToSend: ethers.BigNumber
) {
  const slippageTolerance =
    parseFloat(slippageToleranceStr.replace('%', '')) / 100;

  const slippageBasisPoints = Math.floor(slippageTolerance * 10000);

  const slippageAdjustedAmountOut = amountToSend
    .mul(ethers.BigNumber.from(10000))
    .div(10000 - slippageBasisPoints);

  return slippageAdjustedAmountOut;
}
