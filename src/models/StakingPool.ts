import { Token } from './Token';
import { StakingPoolDTO } from './dtos';

export class StakingPool {
  token: Token;
  stakingAmount: number;
  apy: number;

  constructor(details: StakingPoolDTO) {
    this.token = new Token(details.token);
    this.stakingAmount = details.stakingAmount;
    this.apy = details.apy;
  }
}
