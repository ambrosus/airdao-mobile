import { ethers } from 'ethers';

export enum LogStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning'
}

export interface ILogs {
  amount: ethers.BigNumber;
  date: string;
  status: string;
}

export interface IAvailableWithdrawLogs {
  text: string;
  status: LogStatus;
  timestamp: number;
}
