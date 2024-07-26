import axios from 'axios';
import Config from '@constants/config';

export function claimExpiredOrder(userAddress: string, txHash: string) {
  return axios.post(`${Config.NETWORK_URL}/v2/api/orders/`, {
    userAddress,
    txHash
  });
}
