import { ethers } from 'ethers';
import Config from '@constants/config';
import { currentProvider } from '@lib';
import { CalculateGasFee } from '@lib/bridgeSDK/models/types';
import { Cache, CacheKey } from '@lib/cache';
import { MySdk } from '../sdk/index';

export async function bridgeWithdraw({
  bridgeConfig,
  fromNetwork,
  withdrawData
}: CalculateGasFee) {
  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
  const { tokenFrom, tokenTo, selectedAccount, amountTokens, feeData, gasFee } =
    withdrawData;
  const privateKey = (await Cache.getItem(
    // @ts-ignore
    `${CacheKey.WalletPrivateKey}-${selectedAccount._raw?.hash}`
  )) as string;
  const provider = await currentProvider(fromNetwork);
  const singer = new ethers.Wallet(privateKey, provider);
  return await sdk.withdraw(
    tokenFrom,
    tokenTo,
    selectedAccount.address,
    amountTokens,
    feeData,
    singer,
    gasFee
  );
}
