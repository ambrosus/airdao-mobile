import { BridgeSDK } from '@api/bridge/sdk/index';
import { Config as BridgeConfig, Network, Token } from '@api/bridge/sdk/types';
import { ethers } from 'ethers';
import Config from '@constants/config';

interface DataForFeeModel {
  tokenFrom: Token;
  tokenTo: Token;
  amountTokens: string;
  isMax: boolean;
}
interface GetFeeDataModel {
  bridgeConfig: BridgeConfig;
  dataForFee: DataForFeeModel;
}

interface GetBalanceModel {
  from: string;
  token: Token;
  ownerAddress: string;
}

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

export async function currentProvider(from: string) {
  switch (from) {
    case 'eth':
      return new ethers.providers.JsonRpcProvider(Config.ETH_NETWORK_URL);
    case 'amb':
      return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    case 'bsc':
      return new ethers.providers.JsonRpcProvider(Config.BSC_NETWORK_URL);
  }
}

export async function getBridgePairs({
  from,
  to,
  bridgeConfig
}: {
  walletHash: string;
  from: Network;
  to: Network;
  bridgeConfig: BridgeConfig;
}) {
  // const privateKey = (await Cache.getItem(
  //   `${CacheKey.WalletPrivateKey}-${walletHash}`
  // )) as string;

  // const signer = new ethers.Wallet(privateKey, providerAmb);

  const sdk = new MySdk(bridgeConfig, {
    relayUrls: {
      eth: 'https://relay-eth.ambrosus.io/fees',
      bsc: 'https://relay-bsc.ambrosus.io/fees'
    }
  });
  const provider = currentProvider(from);
  return {
    name: `${from}->${to}`,
    pairs: sdk.getPairs(from, to),
    provider
  };
}

// TODO BRIDGE write types
export async function getFeeData({
  bridgeConfig,
  dataForFee
}: GetFeeDataModel) {
  const { tokenFrom, tokenTo, amountTokens, isMax } = dataForFee;
  const feeSymbol = (() => {
    const { isNativeCoin } = tokenFrom;
    const isETHNetwork = !isNativeCoin && tokenFrom.bridgeNetwork === 'eth';
    const isBSCNetwork = !isNativeCoin && tokenFrom.bridgeNetwork === 'bsc';
    switch (true) {
      case isETHNetwork:
        return 'eth';
      case isBSCNetwork:
        return 'bnb';
      default:
        return 'amb';
    }
  })();

  const sdk = new MySdk(bridgeConfig, {
    relayUrls: {
      eth: 'https://relay-eth.ambrosus.io/fees',
      bsc: 'https://relay-bsc.ambrosus.io/fees'
    }
  });
  const fee = sdk.getFeeData(tokenFrom, tokenTo, amountTokens, isMax);
  return { ...(await fee), feeSymbol };
}

export async function getBalance({
  from,
  token,
  ownerAddress
}: GetBalanceModel) {
  const provider = await currentProvider(from);
  if (!ownerAddress) {
    return null;
  }

  if (token.isNativeCoin) {
    return provider?.getBalance(ownerAddress);
  }
  const minABI = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function'
    }
  ];
  const contract = new ethers.Contract(token.address, minABI, provider);

  return contract.balanceOf(ownerAddress);
}

export const bridgeSDK = {
  getBridgePairs,
  getFeeData,
  getBalance
};
