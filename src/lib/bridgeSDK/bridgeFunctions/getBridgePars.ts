import { Config as BridgeConfig, Network } from '@lib/bridgeSDK/models/types';
import Config from '@constants/config';
import { MySdk } from '../sdk';
import { currentProvider } from './currentProveder';

export async function getBridgePairs({
  from,
  to,
  bridgeConfig
}: {
  from: Network | string;
  to: Network | string;
  bridgeConfig: BridgeConfig;
}) {
  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
  const provider = currentProvider(from);
  return {
    name: `${from}->${to}`,
    // @ts-ignore
    pairs: sdk.getPairs(from, to),
    provider
  };
}
