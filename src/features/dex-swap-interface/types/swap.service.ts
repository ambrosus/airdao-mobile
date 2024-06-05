import { TokenInfo } from './tokens';

export interface BalanceArgs {
  token: TokenInfo;
  ownerAddress: string;
}

export interface CheckAllowanceArgs {
  readonly tokenFrom: string;
  readonly walletAddress: string;
}
