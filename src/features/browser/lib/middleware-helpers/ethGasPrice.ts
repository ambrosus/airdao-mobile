import { ethers } from 'ethers';
import Config from '@constants/config';
import { JsonRpcResponse } from '../../types';

const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

export const ethGasPrice = async (response: JsonRpcResponse) => {
  try {
    const gasPrice = await provider.getGasPrice();
    response.result = gasPrice.toHexString();
  } catch (error: any) {
    response.error = {
      code: -32603,
      message: error.message || 'eth_gasPrice failed'
    };
  }
};
