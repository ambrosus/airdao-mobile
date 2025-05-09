import { getBridgeFeeData } from '@lib';
import { Config, Token } from '@lib/bridgeSDK/models/types';

interface GetFeeDataModel {
  amountTokens: string;
  isMaxOptions: boolean;
  selectedTokenFrom: Token;
  selectedTokenDestination: Token;
  bridgeConfig: Config | null;
}
export const getFeeData = async ({
  bridgeConfig,
  amountTokens,
  selectedTokenFrom,
  selectedTokenDestination,
  isMaxOptions
}: GetFeeDataModel) => {
  const dataForFee = {
    tokenFrom: selectedTokenFrom,
    tokenTo: selectedTokenDestination,
    amountTokens,
    isMax: isMaxOptions
  };
  try {
    if (bridgeConfig) {
      const fee = await getBridgeFeeData({
        bridgeConfig,
        dataForFee
      });
      if (fee) {
        return fee;
      }
    }
  } catch (e) {
    throw e;
  }
};
