import { TokenDTO } from './TokenDTO';

export interface StakingPoolDTO {
  token: TokenDTO;
  totalStake: number;
  userStake: number;
  earnings: number;
  apy: number;
}
