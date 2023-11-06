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
    stakingAmount: 20,
    apy: 10.45
  },
  {
    token: new Token({
      name: 'Hera pool token',
      address: '1312312',
      balance: { wei: '', ether: Number(0) || 0 },
      symbol: AirDAODictTypes.Code.AMB
    }),
    stakingAmount: 1000,
    apy: 18.9
  }
];
