import { ethers } from 'ethers';

export function minimumAmountOut(
  slippageToleranceStr: string,
  amountToReceive: ethers.BigNumber
) {
  const slippageTollerance =
    parseFloat(slippageToleranceStr.replace('%', '')) / 100;

  const slippageBasisPoints = Math.floor(slippageTollerance * 10000);

  const slippageAdjustedAmountOut = amountToReceive
    .mul(ethers.BigNumber.from(10000 - slippageBasisPoints))
    .div(10000);

  return slippageAdjustedAmountOut;
}
