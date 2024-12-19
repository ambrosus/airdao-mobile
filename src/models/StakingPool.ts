import { StakingPoolDTO } from './dtos';
import { Token } from './Token';

export class StakingPool {
  token: Omit<Token, 'balance'>;
  totalStake: number;
  userStake: number;
  earnings: number;
  apy: number;
  tokenPrice: number;
  isActive: boolean;

  constructor(details: StakingPoolDTO, tokenUtils: any) {
    // @ts-ignore
    this.token = new Token({ address: details.tokenAddress }, tokenUtils);
    this.userStake = 0; // TODO
    this.totalStake = Number(details.totalStake);
    this.earnings = 0; // TODO
    this.apy = details.apy ? Number(details.apy) : 0;
    this.tokenPrice = Number(details.tokenPrice);
    this.isActive = details.active;
  }
}
