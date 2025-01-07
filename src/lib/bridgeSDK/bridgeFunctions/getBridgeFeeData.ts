import Config from '@constants/config';
import { GetFeeDataModel } from '@lib/bridgeSDK/models/types';
import { MySdk } from '../sdk/index';

export async function getBridgeFeeData({
  bridgeConfig,
  dataForFee
}: GetFeeDataModel) {
  const { tokenFrom, tokenTo, amountTokens, isMax } = dataForFee;

  const sdk = new MySdk(bridgeConfig, Config.BRIDGE_RELAY_URLS);

  return await sdk.getFeeData(tokenFrom, tokenTo, amountTokens, isMax);
}
