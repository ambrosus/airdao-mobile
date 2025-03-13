import { ethers } from 'ethers';
import Config from '@constants/config';
import { EthCallProps } from '@features/browser/types';
import { rpcRejectHandler } from '@features/browser/utils';

export const ethCall = async ({ data, response }: EthCallProps) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

    const tx = {
      to: data.to,
      data: data.data
    };

    response.result = await provider.call(tx);
  } catch (error) {
    response.error = rpcRejectHandler(32000, {
      message: (error as Error)?.message || 'eth_call execution failed'
    });
  }
};
