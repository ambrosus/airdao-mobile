import { BridgeSDK } from '@api/bridge/sdk/index';
import {
  CalculateGasFee,
  Config as BridgeConfig,
  GetBalanceModel,
  GetFeeDataModel,
  Network,
  Token
} from '@api/bridge/sdk/types';
import { ethers } from 'ethers';
import Config from '@constants/config';
import { Cache, CacheKey } from '@lib/cache';

export class MySdk extends BridgeSDK {
  getPairs(
    sourceNetwork: Network,
    destinationNetwork: Network
  ): [Token, Token][] {
    const result = super.getPairs(sourceNetwork, destinationNetwork);
    return result.map(([from, to]) => [this.mapToken(from), this.mapToken(to)]);
  }

  mapToken(token: Token): Token {
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

  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
  const fee = await sdk.getFeeData(tokenFrom, tokenTo, amountTokens, isMax);
  return { ...fee, feeSymbol };
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
  return await contract.balanceOf(ownerAddress);
}

export async function calculateGasFee({
  bridgeConfig,
  from,
  withdrawData
}: CalculateGasFee) {
  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
  const { tokenFrom, tokenTo, selectedAccount, amountTokens, feeData } =
    withdrawData;
  const privateKey = (await Cache.getItem(
    // @ts-ignore
    `${CacheKey.WalletPrivateKey}-${selectedAccount._raw?.hash}`
  )) as string;
  const provider = await currentProvider(from);
  const singer = new ethers.Wallet(privateKey, provider);
  return await sdk.withdraw(
    tokenFrom,
    tokenTo,
    selectedAccount.address,
    amountTokens,
    feeData,
    singer,
    true
  );
}

export const bridgeSDK = {
  calculateGasFee,
  getBridgePairs,
  getFeeData,
  getBalance
};
