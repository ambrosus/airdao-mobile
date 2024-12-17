import { parseUnits } from 'ethers/lib/utils';
import { getBridgeFeeData } from '@lib';
import { Config, Token } from '@lib/bridgeSDK/models/types';

interface GetFeeDataModel {
  amountTokens: string;
  isMaxOptions: boolean;
  selectedTokenFrom: Token;
  selectedTokenDestination: Token;
  setTemplateDataLoader: (value: boolean) => void;
  bridgeConfig: Config | null;
}
export const getFeeData = async ({
  bridgeConfig,
  amountTokens,
  selectedTokenFrom,
  selectedTokenDestination,
  isMaxOptions
}: GetFeeDataModel) => {
  // we need to subtract 1 from the balance to avoid inaccuracies in calculations about the maximum transfer amount
  const amountToSubtract = '1';
  const balanceToFee = selectedTokenFrom.isNativeCoin
    ? // @ts-ignore
      selectedTokenFrom.balance.sub(
        parseUnits(amountToSubtract, selectedTokenFrom.decimals)
      )
    : selectedTokenFrom.balance;

  const isAmountToFeeLessThenZero = balanceToFee.lt(0);

  const dataForFee = {
    tokenFrom: selectedTokenFrom,
    tokenTo: selectedTokenDestination,
    amountTokens,
    isMax: isMaxOptions
  };
  try {
    if (isAmountToFeeLessThenZero) {
      throw Error('amount to small');
    }

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
    return e;
    // ignore
  }
};
