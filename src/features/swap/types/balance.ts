import { ethers } from 'ethers';
import { FIELD } from './field';
import { SwapToken } from './token';

export interface BalanceGettersArgs {
  token: SwapToken;
  ownerAddress: string;
}

type MultiplyBalancesType = ethers.BigNumber | null;
export type MultiplyBalancesStateType = Record<
  keyof typeof FIELD,
  MultiplyBalancesType
>;
