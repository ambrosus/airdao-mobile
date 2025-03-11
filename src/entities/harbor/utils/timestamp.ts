import { ethers } from 'ethers';
import Config from '@constants/config';

export async function getTimestampFromBlockHash(
  transaction: ethers.ContractReceipt | null
) {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  if (transaction) {
    return (await provider.getBlock(transaction.blockNumber)).timestamp;
  }
}
