import { ethers } from 'ethers';

export interface OutAmountGetterArgs {
  amountToSell: ethers.BigNumber;
  path: string[];
}
