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

export interface HarborStoreModel {
  data: HarborDataModel;
  activeAmbTier: TierRewardItem;
  setActiveAmbTier: (payload: TierRewardItem) => void;
  activeBondTier: TierRewardItem;
  claimAmount: BigNumber;
  getClaimAmount: (payload: string) => void;
  setActiveBondTier: (payload: TierRewardItem) => void;
  bondAmount: string;
  setRewardAmount: (payload: { ambAmount: string; bondAmount: string }) => void;
  ambAmount: string;
  loading: boolean;
  updateAll: (payload: string) => void;
}
