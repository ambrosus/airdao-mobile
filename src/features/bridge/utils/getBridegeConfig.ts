import { API } from '@api/api';

export const getBridgeConfig = async () => {
  return await API.bridgeService.getBridgeParams();
};
