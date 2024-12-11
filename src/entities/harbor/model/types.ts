import { BigNumber } from 'ethers';
import { Token } from '@models';

interface UnStakeLimitModel {
  rate: string;
  delay: number;
}

export interface HarborDataModel {
  apr: string;
  token: Token;
  tier: number;
  unStakeLimit: UnStakeLimitModel;
  totalStaked: BigNumber;
  stakeLimit: BigNumber;
  userStaked: BigNumber;
}

export type RewardTokenNames = 'amb' | 'bond';

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
  loading: boolean;
  updateAll: (payload: string) => void;
}
