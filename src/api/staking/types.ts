import { ethers } from 'ethers';

export interface PoolDetailsArgs {
  providerOrSigner?: ethers.providers.JsonRpcProvider;
  address?: string;
  poolName?: string;
}

export interface ReturnedPoolDetails {
  addressHash: string;
  contractName: string;
  active: boolean;
  user: {
    amb: number;
    pool: number;
  };
}
