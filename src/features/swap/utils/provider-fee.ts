import { ethers } from 'ethers';

const LIQUIDITY_PROVIDER_FEE = 0.003;

export function realizedLPFee(amountToSell: string): string {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const bnFee = bnAmountToSell
    .mul(ethers.utils.parseEther(LIQUIDITY_PROVIDER_FEE.toString()))
    .div(ethers.constants.WeiPerEther);
  return ethers.utils.formatEther(bnFee);
}

export function subtractRealizedLPFeeFromInput(amountToSell: string): string {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const bnLiquidityProviderFee = ethers.utils.parseEther(
    realizedLPFee(amountToSell)
  );
  const bnResult = bnAmountToSell.sub(bnLiquidityProviderFee);
  return ethers.utils.formatEther(bnResult);
}

export function calculateAllowanceWithProviderFee(amountToSell: string) {
  const liquidityProviderFee = realizedLPFee(amountToSell);

  const normalizedAmountToSell = Number(amountToSell).toFixed(18);
  const normalizedLiquidityProviderFee = liquidityProviderFee;

  const bnAmountToSell = ethers.utils.parseEther(normalizedAmountToSell);
  const bnLiquidityProviderFee = ethers.utils.parseEther(
    normalizedLiquidityProviderFee
  );

  const result = bnAmountToSell.add(bnLiquidityProviderFee);
  const formattedResult = ethers.utils.formatEther(result);

  return Number(formattedResult).toFixed(18);
}
