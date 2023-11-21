import { Token } from './Token';
import { StakingPoolDTO } from './dtos';

export class StakingPool {
  token: Token;
  totalStake: number;
  userStake: number;
  earnings: number;
  apy: number;

  constructor(details: StakingPoolDTO) {
    this.token = new Token(details.token);
    this.userStake = details.userStake;
    this.totalStake = details.totalStake;
    this.earnings = details.earnings;
    this.apy = details.apy;
  }
}
