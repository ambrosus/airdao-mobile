import { BigNumber } from 'ethers';
import { Token } from '@models';

export interface HarborDataModel {
  apr: string;
  totalStaked: BigNumber;
  stakeLimit: BigNumber;
  userStaked: BigNumber;
}

export interface HarborStoreModel {
  data: HarborDataModel;
  token: Token;
  loading: boolean;
  updateAll: (payload: string) => void;
}
