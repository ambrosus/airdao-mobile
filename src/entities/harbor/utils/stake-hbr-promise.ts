import { BigNumber } from 'ethers';
import { hbrYieldService } from '@api/harbor';

type StakeHBRResult = [
  BigNumber, // stake
  BigNumber, // rewards
  BigNumber, // deposit
  any, // limitsConfig
  [BigNumber], // poolInfo
  BigNumber, // maxUserStakeValue
  BigNumber // allowance
];

export const stakeHbrPromise = async (
  address: string
): Promise<StakeHBRResult | null> => {
  try {
    return Promise.all([
      await hbrYieldService.staked(address),
      await hbrYieldService.rewards(address),
      await hbrYieldService.deposit(address),
      await hbrYieldService.limitConfig(),
      await hbrYieldService.liquidityPool(),
      await hbrYieldService.maxUserStakeLimit(address),
      await hbrYieldService.allowance(address)
    ]);
  } catch (error) {
    return null;
  }
};
