import { TokenInfo } from './tokens';

export interface BalanceArgs {
  token: TokenInfo;
  ownerAddress: string;
}

export interface _CheckAllowanceArgs {
  readonly tokenFrom: string;
  readonly walletAddress: string;
}

export interface CheckAllowanceArgs {
  readonly addressFrom: string;
  readonly privateKey: string;
  readonly amountAllowance: string | number;
}

export interface IncreaseAllowanceArgs {
  readonly addressFrom: string;
  readonly walletAddress: string;
}
