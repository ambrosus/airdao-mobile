import {
  BridgeAddresses,
  BridgeNetwork,
  Config,
  ConfigToken,
  Network,
  Token
} from './types';
import { isAddress } from 'ethers/lib/utils';

export function formatBridgeAddresses(config: Config): BridgeAddresses {
  const result: BridgeAddresses = {};

  for (const [network, { amb, side }] of Object.entries(config.bridges)) {
    if (!result.amb) result.amb = {};
    if (!result[network]) result[network] = {};

    result.amb[network] = amb;
    result[network].amb = side;
  }

  return result;
}

export function getPairs(
  configFile: Config,
  sourceNetwork: Network,
  destinationNetwork: Network
) {
  const bridgeNetwork = detectBridgeNetwork(sourceNetwork, destinationNetwork);
  const tokenPairs: [Token, Token][] = [];

  // NOTE: only one token can be the wrapper for native coin
  // if there are multiple - we need to select the latest occurrence in config
  // (for destination it's restriction of a contracts implementation, for source it's just dumb to have multiple wrappers for the same coin')
  // and it's already a case with multiple tokens: SAMB and SAMB2  in eth->amb bridge
  // so, reverse tokens array and store the flags below

  const tokens = Object.values(configFile.tokens).reverse();
  let isAnySourceNativeWrapper = false;
  let isAnyDestinationNativeWrapper = false;

  for (const token of tokens) {
    if (!token.isActive) continue;
    const [tokenSource, tokenDest] = [
      token.networks[sourceNetwork],
      token.networks[destinationNetwork]
    ];

    // token must be deployed on both sides
    if (!isAddress(tokenSource?.address) || !isAddress(tokenDest?.address))
      continue;

    const createPair = (
      nativeSource: boolean,
      nativeDest: boolean
    ): [Token, Token] => [
      createToken(token, bridgeNetwork, sourceNetwork, nativeSource),
      createToken(token, bridgeNetwork, destinationNetwork, nativeDest)
    ];

    // create erc20 -> erc20 pair
    tokenPairs.push(createPair(false, false));

    // create native -> erc20 if need
    if (
      tokenSource.isPrimary &&
      tokenSource.nativeCoin &&
      !isAnySourceNativeWrapper
    ) {
      tokenPairs.push(createPair(true, false));
      isAnySourceNativeWrapper = true;
    }

    // create erc20 -> native if need
    if (
      tokenDest.isPrimary &&
      tokenDest.nativeCoin &&
      !isAnyDestinationNativeWrapper
    ) {
      tokenPairs.push(createPair(false, true));
      isAnyDestinationNativeWrapper = true;
    }
  }

  return tokenPairs;
}

function createToken(
  configToken: ConfigToken,
  bridgeNetwork: BridgeNetwork,
  network: Network,
  isNativeCoin: boolean
): Token {
  const networkToken = configToken.networks[network];

  return {
    name: configToken.name,
    symbol: configToken.symbol,
    address: networkToken.address,
    decimals: networkToken.denomination,
    isNativeCoin,
    network,
    bridgeNetwork
  };
}

function detectBridgeNetwork(
  sourceNetwork: Network,
  destinationNetwork: Network
): BridgeNetwork {
  if (sourceNetwork === destinationNetwork)
    throw new Error('sourceNetwork and destinationNetwork must be different');
  if (sourceNetwork !== 'amb') return sourceNetwork;
  if (destinationNetwork !== 'amb') return destinationNetwork;
  throw new Error("can't be");
}
