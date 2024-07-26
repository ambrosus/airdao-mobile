import { ethers } from 'ethers';

export interface AllowanceArgs {
  address: string;
  privateKey: string;
  amount: ethers.BigNumber;
}
