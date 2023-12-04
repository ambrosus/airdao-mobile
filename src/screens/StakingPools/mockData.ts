import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { StakingPool, Token } from '@models';

export const mockStakingPools: StakingPool[] = [
  {
    token: new Token({
      name: 'AirDAO',
      address: '1312312',
      balance: { wei: '', ether: Number(0) || 0 },
      symbol: AirDAODictTypes.Code.AMB
    }),
    totalStake: 200000,
    userStake: 0,
    earnings: 0,
    apy: 10.45
  },
  {
    token: new Token({
      name: 'Hera pool token',
      address: '1312312',
      balance: { wei: '', ether: Number(0) || 0 },
      symbol: AirDAODictTypes.Code.AMB
    }),
    totalStake: 200000,
    userStake: 20,
    earnings: 1000,
    apy: 18.9
  }
];
