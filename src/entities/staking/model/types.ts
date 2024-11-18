import { ethers } from 'ethers';

export interface StakingPool {
  addressHash: string;
  contractName: string;
  active: boolean;
  user: {
    amb: number;
    raw: ethers.BigNumber;
  };
}
