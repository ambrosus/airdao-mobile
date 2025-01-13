import { ethers } from 'ethers';

export function minimumAmountOut(
  slippageToleranceStr: string,
  amountToReceive: ethers.BigNumber
) {
  // Convert percentage string to basis points (1 basis point = 0.01%)
  const slippageBips = Math.round(
    parseFloat(slippageToleranceStr.replace('%', '')) * 100
  );

  // Calculate minimum amount: amountToReceive * (10000 - slippageBips) / 10000
  return amountToReceive
    .mul(ethers.BigNumber.from(10000 - slippageBips))
    .div(10000);
}

export function maximumAmountIn(
  slippageToleranceStr: string,
  amountToSend: ethers.BigNumber
) {
  // Convert percentage string to decimal (e.g., "0.5%" -> 0.005)
  const slippageTolerance =
    parseFloat(slippageToleranceStr.replace('%', '')) / 100;

  // Calculate maximum amount: amountToSend * (1 + slippage)
  return amountToSend.add(
    amountToSend
      .mul(ethers.BigNumber.from(Math.floor(slippageTolerance * 10000)))
      .div(10000)
  );
}
