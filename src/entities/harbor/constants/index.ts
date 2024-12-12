import { BigNumber } from 'ethers';
import { Token } from '@models';
import { CryptoCurrencyCode } from '@appTypes';
import { TokenUtils } from '@utils/token';
import { TierRewardList } from '@entities/harbor/model/types';

export const EMPTY_TOKEN = new Token(
  {
    address: '',
    decimals: 18,
    name: 'Staked AMB',
    symbol: CryptoCurrencyCode.stAMB,
    isNativeCoin: false,
    balance: {
      formattedBalance: '0',
      wei: '0',
      ether: 0
    },
    tokenNameFromDatabase: 'Staked AMB'
  },
  TokenUtils
);

export const EMPTY_UN_STAKE_LIMIT = {
  rate: '',
  delay: 0
};

export const DEFAULT_DATA = {
  apr: '0',
  token: EMPTY_TOKEN,
  tier: 1,
  unStakeDelay: EMPTY_UN_STAKE_LIMIT,
  totalStaked: BigNumber.from(0),
  stakeLimit: BigNumber.from(0),
  userStaked: BigNumber.from(0)
};

export const DEFAULT_STAKE_PREVIEW = {
  amount: '',
  token: CryptoCurrencyCode.AMB,
  receiveAmount: '',
  receiveToken: CryptoCurrencyCode.stAMB,
  fromAddress: '',
  apy: ''
};
export const DEFAULT_WITHDRAW_PREVIEW = {
  amount: '0',
  rewardAmb: '0',
  rewardBond: '0',
  delay: 0
};

export const EMPTY_SELECTED_TIER = { id: 'empty', value: 0, availableOn: 0 };
export const REWARD_TIERS_LIST: TierRewardList = {
  amb: [
    { id: 'amb1', value: 0.25, availableOn: 1 },
    { id: 'amb2', value: 0.5, availableOn: 2 },
    { id: 'amb3', value: 0.75, availableOn: 3 },
    { id: 'amb4', value: 1, availableOn: 4 }
  ],
  bond: [
    { id: 'bond1', value: 0.25, availableOn: 3 },
    { id: 'bond2', value: 0.5, availableOn: 2 },
    { id: 'bond3', value: 0.75, availableOn: 1 },
    { id: 'bond4', value: 1, availableOn: 4 }
  ]
};
