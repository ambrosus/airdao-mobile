import { ethers } from 'ethers';
import Config from '@constants/config';
import { EthEstimateGasProps } from '@features/browser/types';
import { rpcErrorHandler } from '@features/browser/utils';

export const ethEstimateGas = async ({
  response,
  data
}: EthEstimateGasProps) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    const estimatedGas = await provider.estimateGas(data);

    response.result = estimatedGas.toHexString();
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    response.error = {
      code: -32000,
      message: `Gas estimation failed: ${(error as Error).message}`
    };
  }
};
