import { GetFeeDataModel } from '@lib/bridgeSDK/models/types';
import Config from '@constants/config';
import { MySdk } from '../sdk/index';

export async function getBridgeFeeData({
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
