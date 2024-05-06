import { BridgeSDK } from '@api/bridge/sdk/index';
import { Network, Token } from '@api/bridge/sdk/types';
import { ethers } from 'ethers';
import Config from '@constants/config';
import { API } from '@api/api';

export class MySdk extends BridgeSDK {
  getPairs(
    sourceNetwork: Network,
    destinationNetwork: Network
  ): [Token, Token][] {
    const result = super.getPairs(sourceNetwork, destinationNetwork);
    return result.map(([from, to]) => [this.mapToken(from), this.mapToken(to)]);
  }

  mapToken(token: Token): Token {
    // todo logos
    // todo if isNativeCoin you can change name or symbol, for example:
    //   use networkToken.nativeCoin (it's a symbol of native coin)
    //   or create a mapping (networkName => {name, symbol, logo, ...}) for native coins

    if (token.isNativeCoin) token.name += ' (NATIVE)';
    return token;
  }
}

export async function getBridgePairs({
  from,
  to
}: {
  walletHash: string;
  from: Network;
  to: Network;
}) {
  const providerAmb = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  const providerEth = new ethers.providers.JsonRpcProvider(
    Config.ETH_NETWORK_URL
  );
  const providerBsc = new ethers.providers.JsonRpcProvider(
    Config.BSC_NETWORK_URL
  );

  // const privateKey = (await Cache.getItem(
  //   `${CacheKey.WalletPrivateKey}-${walletHash}`
  // )) as string;

  // const signer = new ethers.Wallet(privateKey, providerAmb);

  const config = await API.bridgeService.getBridgeParams();

  const sdk = new MySdk(config.data, {
    relayUrls: {
      eth: 'https://relay-eth.ambrosus.io/fees',
      bsc: 'https://relay-bsc.ambrosus.io/fees'
    }
  });

  const currentProvider = (from: string) => {
    switch (from) {
      case 'eth':
        return providerEth;
      case 'amb':
        return providerAmb;
      case 'bsc':
        return providerBsc;
    }
  };
  return {
    name: `${from}->${to}`,
    pairs: sdk.getPairs(from, to),
    provider: currentProvider(from)
  };
}
