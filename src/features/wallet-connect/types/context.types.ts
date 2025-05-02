import { ethers } from 'ethers';

export enum CONNECT_VIEW_STEPS {
  INITIAL = 'INITIAL',
  APPROVE = 'APPROVE',
  PENDING = 'PENDING',
  EIP155_TRANSACTION = 'EIP155_TRANSACTION',
  CONNECT_ERROR = 'CONNECT_ERROR',
  PAIR_EXPIRED_ERROR = 'PAIR_EXPIRED_ERROR',
  WRONG_CHAIN_ERROR = 'WRONG_CHAIN_ERROR'
}
export type WalletConnectViewValues = keyof typeof CONNECT_VIEW_STEPS;

export interface StandardizedDecodedArgs {
  amount?: ethers.BigNumber;
  addresses?: string[];
  deadline?: string;
  gas?: ethers.BigNumber;
  from?: string;
  message?: string;
}

export interface DecodedTransaction {
  functionName: string;
  decodedArgs: StandardizedDecodedArgs | null;
}

export type DecodedTransactionState = DecodedTransaction | null;
