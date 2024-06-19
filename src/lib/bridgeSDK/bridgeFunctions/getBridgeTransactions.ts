import { API } from '@api/api';

export const getBridgeTransactions = async (address = '') => {
  return await API.bridgeService.getBridgeHistory(address);
};
