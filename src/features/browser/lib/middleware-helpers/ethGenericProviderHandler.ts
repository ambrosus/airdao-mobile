import { ethers } from 'ethers';
import Config from '@constants/config';
import { JsonRpcResponse } from '../../types';

const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

export const ethGenericProviderHandler = async ({
  method,
  params,
  response
}: {
  method: string;
  params: any[];
  response: JsonRpcResponse;
}) => {
  try {
    response.result = await provider.send(method, params);
  } catch (error: any) {
    response.error = {
      code: -32603,
      message: error.message || `${method} failed`
    };
  }
};
