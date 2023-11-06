import { TokenDTO } from './TokenDTO';

export interface StakingPoolDTO {
  token: TokenDTO;
  stakingAmount: number;
  apy: number;
}
