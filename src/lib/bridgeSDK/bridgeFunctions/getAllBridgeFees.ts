import { BigNumber, ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import Config from '@constants/config';
import { ROUNDING_BUFFER } from '@constants/variables';
import { getFeeData } from '@features/bridge/utils/getBridgeFee';
import { currentProvider } from '@lib';
import { calculateGazFee } from '@lib/bridgeSDK/bridgeFunctions/calculateGazFee';
import {
  CalculateGasFeeModel,
  FeeData,
  GetAllBridgeFeesProps
} from '@lib/bridgeSDK/models/types';
import { MySdk } from '@lib/bridgeSDK/sdk';
import { Cache, CacheKey } from '@lib/cache';
import { delay } from '@utils';

export const getAllBridgeFees = async ({
  isMax,
  bridgeConfig,
  fromNetwork,
  selectedTokenFrom,
  amountToBridge,
  selectedTokenDestination,
  selectedWallet
}: GetAllBridgeFeesProps): Promise<{
  feeData?: FeeData;
  gasFee: BigNumber;
}> => {
  if (isMax) {
    const gasFee = await calculateGazFee({
      bridgeConfig,
      fromNetwork,
      tokenFrom: selectedTokenFrom,
      amountTokens: amountToBridge,
      tokenTo: selectedTokenDestination,
      selectedAccount: selectedWallet,
      isMax
    } as CalculateGasFeeModel);

    await delay(1000);

    const gasFeePlusBuffer = gasFee.add(parseEther(ROUNDING_BUFFER));

    // amountTokens = amountToBridge - gasFee - ROUNDING_BUFFER
    const amountTokens =
      selectedTokenFrom.isNativeCoin && isMax
        ? formatEther(parseEther(amountToBridge).sub(gasFeePlusBuffer))
        : amountToBridge;
    const feeData = await getFeeData({
      bridgeConfig,
      amountTokens,
      selectedTokenFrom,
      selectedTokenDestination,
      isMaxOptions: isMax
    });
    return { gasFee, feeData };
  } else {
    const amountTokens =
      selectedTokenFrom.isNativeCoin && isMax
        ? String(+amountToBridge - +ROUNDING_BUFFER)
        : amountToBridge;

    const feeData = await getFeeData({
      bridgeConfig,
      amountTokens,
      selectedTokenFrom,
      selectedTokenDestination,
      isMaxOptions: isMax
    });
    if (feeData) {
      const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedWallet._raw?.hash}`
      )) as string;

      const provider = await currentProvider(fromNetwork);
      const signer = new ethers.Wallet(privateKey, provider);
      const gasPrice = await provider.getGasPrice();
      const gasLimit = await sdk.withdraw(
        selectedTokenFrom,
        selectedTokenDestination,
        selectedWallet.address,
        amountTokens,
        feeData,
        signer,
        true
      );

      const gasFee = gasPrice.mul(gasLimit);

      return { gasFee, feeData };
    } else throw new Error('Unable to get feeData on getAllBridgeFees');
  }
};
