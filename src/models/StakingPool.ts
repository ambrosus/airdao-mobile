import { Token } from './Token';
import { StakingPoolDTO } from './dtos';

export class StakingPool {
  token: Omit<Token, 'balance'>;
  totalStake: number;
  userStake: number;
  earnings: number;
  apy: number;
  tokenPrice: number;
  isActive: boolean;

  constructor(details: StakingPoolDTO) {
    // @ts-ignore
    this.token = new Token({ address: details.tokenAddress });
    this.userStake = 0; // TODO
    this.totalStake = Number(details.totalStake);
    this.earnings = 0; // TODO
    this.apy = details.apy ? Number(details.apy) : 0;
    this.tokenPrice = Number(details.tokenPrice);
    this.isActive = details.active;
  }
}
