import { ethers } from 'ethers';
import { SwapToken } from './token';
import { FIELD } from './field';

export interface BalanceGettersArgs {
  token: SwapToken;
  ownerAddress: string;
}

type MultiplyBalancesType = ethers.BigNumber | null;
export type MultiplyBalancesStateType = Record<
  keyof typeof FIELD,
  MultiplyBalancesType
>;
