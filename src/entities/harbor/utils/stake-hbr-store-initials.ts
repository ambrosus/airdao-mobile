import { ethers } from 'ethers';
import { LimitsConfig } from '../model/types';

export const INITIAL_ETHERS_ZERO = ethers.BigNumber.from(0);

export const INITIAL_LIMITS: LimitsConfig = {
  rewardTokenPrice: INITIAL_ETHERS_ZERO,
  interest: INITIAL_ETHERS_ZERO,
  interestRate: INITIAL_ETHERS_ZERO,
  minDepositValue: INITIAL_ETHERS_ZERO,
  minStakeValue: INITIAL_ETHERS_ZERO,
  fastUnstakePenalty: INITIAL_ETHERS_ZERO,
  unstakeLockPeriod: INITIAL_ETHERS_ZERO,
  stakeLockPeriod: INITIAL_ETHERS_ZERO,
  maxTotalStakeValue: INITIAL_ETHERS_ZERO,
  maxStakePerUserValue: INITIAL_ETHERS_ZERO,
  stakeLimitsMultiplier: INITIAL_ETHERS_ZERO
};
