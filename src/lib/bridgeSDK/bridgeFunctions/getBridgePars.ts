import { Config as BridgeConfig, Network } from '@lib/bridgeSDK/models/types';
import Config from '@constants/config';
import { MySdk } from '../sdk';
import { currentProvider } from './currentProveder';
import { getBridgeBalance } from './getBridgeBalance';

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
  // @ts-ignore
  const pairs = sdk.getPairs(from, destination);
  if (ownerAddress) {
    await Promise.all(
      pairs.map(async (pair) => {
        pair[0].balance = await getBridgeBalance({
          from,
          token: pair[0],
          ownerAddress
        });
      })
    );
  }
  return {
    name: `${from}->${destination}`,
    pairs,
    provider
  };
}
