import { ethers } from 'ethers';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';

export async function estimatedNetworkProviderFee(
  estimatedGas: ethers.BigNumber
) {
  const provider = createAMBProvider();
  try {
    const { gasPrice } = await provider.getFeeData();

    const gasPriceNumber = gasPrice ? gasPrice.toNumber() : 0;
    const estimatedGasNumber = estimatedGas.toNumber();

    const totalWei = Math.floor(estimatedGasNumber * gasPriceNumber).toString();
    const result = ethers.utils.parseUnits(totalWei, 'wei');

    return result;
  } catch (error) {
    return ethers.BigNumber.from(0);
  }
}
