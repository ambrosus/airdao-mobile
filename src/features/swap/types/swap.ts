import { ethers } from 'ethers';

export interface OutAmountGetterArgs {
  amountToSell: ethers.BigNumber;
  path: string[];
}
export interface InAmountGetterArgs {
  amountToReceive: ethers.BigNumber;
  path: string[];
}
