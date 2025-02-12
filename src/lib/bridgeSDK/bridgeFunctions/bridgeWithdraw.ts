import { ethers } from 'ethers';
import Config from '@constants/config';
import { currentProvider } from '@lib';
import { BridgeWithdrawModel } from '@lib/bridgeSDK/models/types';
import { Cache, CacheKey } from '@lib/cache';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { MySdk } from '../sdk/index';

export async function bridgeWithdraw({
  bridgeConfig,
  fromNetwork,
  withdrawData
}: BridgeWithdrawModel) {
  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
  const { tokenFrom, tokenTo, selectedAccount, amountTokens, feeData, gasFee } =
    withdrawData;

  const privateKey = (await Cache.getItem(
    // @ts-ignore
    `${CacheKey.WalletPrivateKey}-${selectedAccount._raw?.hash}`
  )) as string;

  const provider = await currentProvider(fromNetwork);

  const signer = new ethers.Wallet(privateKey, provider);
  sendFirebaseEvent(CustomAppEvents.bridge_start);

  const testing = await sdk.withdraw(
    tokenFrom,
    tokenTo,
    selectedAccount.address,
    amountTokens,
    feeData,
    signer,
    gasFee
  );
  return testing;
}
