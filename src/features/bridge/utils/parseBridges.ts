import { getNetworkNames } from './getNetworkName';
import {
  DEFAULT_AMB_NETWORK,
  DEFAULT_ETH_NETWORK
} from '@features/bridge/constants';
import { Config } from '@lib/bridgeSDK/models/types';

export const parsedBridges = (bridgeConfig: Config) => {
  const bridges = Object.keys(bridgeConfig?.bridges || []).map((item) => {
    const res = {
      // @ts-ignore
      ...bridgeConfig?.bridges[item],
      id: item,
      name: getNetworkNames(item)
    };
    if (res.id === 'eth') {
      // tslint:disable-next-line:forin
      for (const key in DEFAULT_ETH_NETWORK) {
        // @ts-ignore
        DEFAULT_ETH_NETWORK[key] = res[key];
      }
    }
    return res;
  });
  return [...bridges, DEFAULT_AMB_NETWORK];
};
