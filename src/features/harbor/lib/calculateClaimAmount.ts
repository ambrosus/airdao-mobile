import { BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { TierRewardItem } from '@entities/harbor/model/types';
import { NumberUtils } from '@utils';

export const calculateClaimAmount = (
  claimAmount: BigNumberish,
  tierValue: TierRewardItem
) => {
  const nmClaimAmount = +formatEther(claimAmount);
  const ambValue = nmClaimAmount * tierValue?.value;
  return {
    ambAmount: NumberUtils.limitDecimalCount(ambValue, 2)
  };
};
