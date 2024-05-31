import { CalculateGasFee } from '@lib/bridgeSDK/models/types';
import Config from '@constants/config';
import { Cache, CacheKey } from '@lib/cache';
import { ethers } from 'ethers';
import { MySdk } from '../sdk/index';
import { currentProvider } from './currentProveder';

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
