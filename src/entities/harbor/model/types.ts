import { BigNumber, ethers } from 'ethers';
import { Token } from '@models';

interface UnstakeDelayModel {
  rate: string;
  delay: string;
}

export interface HarborDataModel {
  apr: string;
  token: Token;
  tier: number;
  unStakeDelay: UnstakeDelayModel;
  totalStaked: BigNumber;
  stakeLimit: BigNumber;
  userStaked: BigNumber;
}

export type RewardTokenNamesModel = 'amb';

export interface TierRewardItem {
  id: string;
  availableOn: number;
  value: number;
}

export interface TierRewardList {
  amb: TierRewardItem[];
}

export interface ILogs {
  amount: BigNumber;
  tokenAddress: string;
  requestData: string;
  unlockData: string;
  status: string;
}

export interface HarborStoreModel {
  data: HarborDataModel;
  withdrawalList: ILogs[];
  withdrawListLoader: boolean;
  activeAmbTier: TierRewardItem;
  ambAmount: string;
  claimAmount: BigNumber;
  loading: boolean;
  setActiveAmbTier: (payload: TierRewardItem) => void;
  setDefaultActiveAmbTiers: () => void;
  updateWithdrawList: (payload: string) => void;
  clearWithdrawList: () => void;
  getClaimAmount: (payload: string) => void;
  setRewardAmount: (payload: { ambAmount: string }) => void;
  updateAll: (payload: string) => void;
}

// Stake HBR
export interface LimitsConfig {
  rewardTokenPrice: ethers.BigNumber;
  interest: ethers.BigNumber;
  interestRate: ethers.BigNumber;
  minDepositValue: ethers.BigNumber;
  minStakeValue: ethers.BigNumber;
  fastUnstakePenalty: ethers.BigNumber;
  unstakeLockPeriod: ethers.BigNumber;
  stakeLockPeriod: ethers.BigNumber;
  maxTotalStakeValue: ethers.BigNumber;
  maxStakePerUserValue: ethers.BigNumber;
  stakeLimitsMultiplier: ethers.BigNumber;
}

export interface StakeHBRStore {
  stake: ethers.BigNumber;
  rewards: ethers.BigNumber;
  deposit: ethers.BigNumber;
  allowance: ethers.BigNumber;
  loading: boolean;
  refreshing: boolean;
  limitsConfig: LimitsConfig;
  maxUserStakeValue: ethers.BigNumber;
  totalPoolLimit: ethers.BigNumber;
  fetchUserAllowance: (payload: string) => Promise<void>;
  hbrYieldFetcher: (
    payload: string,
    key?: 'loading' | 'refreshing'
  ) => Promise<void>;
}

export interface StakeUIStore {
  activeTabIndex: number;
  setActiveTabIndex: (payload: number) => void;
}
