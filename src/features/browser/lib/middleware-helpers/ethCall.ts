import { ethers } from 'ethers';
import Config from '@constants/config';
import { rpcRejectHandler } from '@features/browser/utils';

interface EthCallProps {
  data: {
    to: string;
    data: string;
  };
  response: any;
}
export const ethCall = async ({ data, response }: EthCallProps) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

    const tx = {
      to: data.to,
      data: data.data
    };

    console.log('tx', tx);

    response.result = await provider.call(tx);
  } catch (error) {
    response.error = rpcRejectHandler(32000, {
      message: (error as Error)?.message || 'eth_call execution failed'
    });
  }
};
