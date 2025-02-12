import { ethers } from 'ethers';
import { createAMBProvider } from './contracts/instances';

const LIQUIDITY_PROVIDER_FEE = 0.003;

export function calculateGasMargin(value: ethers.BigNumber): ethers.BigNumber {
  return value
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
    .div(ethers.BigNumber.from(10000));
}

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

export async function wrapEstimatedGas(
  routerContract: ethers.Contract,
  methodName: string,
  args: any[]
) {
  const provider = createAMBProvider();
  try {
    const { gasPrice } = await provider.getFeeData();
    const estimatedGas = await routerContract.estimateGas[methodName](...args);

    const gasWithMargin = calculateGasMargin(estimatedGas);

    const gasPriceNumber = gasPrice ? gasPrice.toNumber() : 0;
    const estimatedGasNumber = gasWithMargin.toNumber();

    const totalWei = Math.floor(estimatedGasNumber * gasPriceNumber).toString();
    const result = ethers.utils.parseUnits(totalWei, 'wei');

    return result;
  } catch (error) {
    return ethers.BigNumber.from(0);
  }
}
