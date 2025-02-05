import { BigNumber, ethers } from 'ethers';

export interface PoolDetailsArgs {
  providerOrSigner?: ethers.providers.JsonRpcProvider;
  address?: string;
  poolName?: string;
}

export interface ReturnedPoolDetails {
  addressHash: string;
  contractName: string;
  totalStakeInAMB: number;
  active: boolean;
  user: {
    amb: number;
    raw: BigNumber;
  };
}

export interface StakeArgs {
  pool: ReturnedPoolDetails;
  value: string;
  walletHash: string;
}
