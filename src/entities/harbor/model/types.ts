import { BigNumber } from 'ethers';
import { Token } from '@models';

interface UnStakeDelayModel {
  rate: string;
  delay: string;
}

export interface HarborDataModel {
  apr: string;
  token: Token;
  tier: number;
  unStakeDelay: UnStakeDelayModel;
  totalStaked: BigNumber;
  stakeLimit: BigNumber;
  userStaked: BigNumber;
}

export type RewardTokenNamesModel = 'amb' | 'bond';

export interface TierRewardItem {
  id: string;
  availableOn: number;
  value: number;
}

export interface TierRewardList {
  amb: TierRewardItem[];
  bond: TierRewardItem[];
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
  setActiveAmbTier: (payload: TierRewardItem) => void;
  activeBondTier: TierRewardItem;
  setDefaultActiveAmbTiers: () => void;
  claimAmount: BigNumber;
  updateWithdrawList: (payload: string) => void;
  clearWithdrawList: () => void;
  getClaimAmount: (payload: string) => void;
  setActiveBondTier: (payload: TierRewardItem) => void;
  bondAmount: string;
  setRewardAmount: (payload: { ambAmount: string; bondAmount: string }) => void;
  ambAmount: string;
  loading: boolean;
  updateAll: (payload: string) => void;
}

export interface BrowserStoreModel {
  connectedAddress: string;
  setConnectedAddress: (address: string) => void;
}
