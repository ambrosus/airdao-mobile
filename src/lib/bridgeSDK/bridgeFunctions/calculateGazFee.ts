import { ethers } from 'ethers';
import Config from '@constants/config';
import { currentProvider, getBridgeFeeData } from '@lib';
import { CalculateGasFeeModel } from '@lib/bridgeSDK/models/types';
import { Cache, CacheKey } from '@lib/cache';
import { MySdk } from '../sdk/index';

export const calculateGazFee = async ({
  bridgeConfig,
  fromNetwork,
  tokenFrom,
  tokenTo,
  selectedAccount,
  amountTokens
}: CalculateGasFeeModel) => {
  const dataForFee = {
    tokenFrom,
    tokenTo,
    amountTokens,
    isMax: false
  };

  const bridgeFee = await getBridgeFeeData({
    bridgeConfig,
    dataForFee
  });

  // gasFee get only gas fee
  const gasFee = true;
  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
  const privateKey = (await Cache.getItem(
    // @ts-ignore
    `${CacheKey.WalletPrivateKey}-${selectedAccount._raw?.hash}`
  )) as string;

  const provider = await currentProvider(fromNetwork);
  const signer = new ethers.Wallet(privateKey, provider);
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await sdk.withdraw(
    tokenFrom,
    tokenTo,
    selectedAccount.address,
    amountTokens,
    bridgeFee,
    signer,
    gasFee
  );
  return gasPrice.mul(gasLimit);
};
