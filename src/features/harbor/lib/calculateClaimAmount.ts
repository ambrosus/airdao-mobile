import { BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import {
  RewardTokenNamesModel,
  TierRewardItem
} from '@entities/harbor/model/types';
import { NumberUtils } from '@utils';

export const calculateClaimAmount = (
  claimAmount: BigNumberish,
  tierValue: TierRewardItem,
  token: RewardTokenNamesModel
) => {
  const isAmbTierPress = token === 'amb';

  if (isAmbTierPress) {
    const nmClaimAmount = +formatEther(claimAmount);
    const ambValue = nmClaimAmount * tierValue?.value;
    return {
      ambAmount: NumberUtils.limitDecimalCount(ambValue, 2),
      bondAmount: NumberUtils.limitDecimalCount(nmClaimAmount - ambValue, 2)
    };
  } else {
    const nmClaimAmount = +formatEther(claimAmount);
    const bondValue = nmClaimAmount * tierValue?.value;
    return {
      ambAmount: NumberUtils.limitDecimalCount(nmClaimAmount - bondValue, 2),
      bondAmount: NumberUtils.limitDecimalCount(bondValue, 2)
    };
  }
};
