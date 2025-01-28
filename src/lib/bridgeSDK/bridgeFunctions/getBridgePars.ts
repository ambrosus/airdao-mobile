import Config from '@constants/config';
import { getAllBridgeTokenBalance } from '@lib/bridgeSDK/bridgeFunctions/getAllBridgeTokenBalance';
import { Config as BridgeConfig, Network } from '@lib/bridgeSDK/models/types';
import { MySdk } from '../sdk';
import { currentProvider } from './currentProveder';

export async function getBridgePairs({
  from,
  destination,
  bridgeConfig,
  ownerAddress
}: {
  from: Network | string;
  destination: Network | string;
  bridgeConfig: BridgeConfig;
  ownerAddress: string;
}) {
  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
  const provider = currentProvider(from);
  const pairs = await getAllBridgeTokenBalance(
    // @ts-ignore
    sdk.getPairs(from, destination),
    from,
    ownerAddress
  );
  return {
    name: `${from}->${destination}`,
    pairs,
    provider
  };
}
