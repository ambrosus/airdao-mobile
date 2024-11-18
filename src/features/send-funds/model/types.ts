import { CryptoCurrencyCode } from '@appTypes';

export interface SendFundsState {
  from: string;
  to: string;
  walletHash: string;
  amount: number;
  currency: CryptoCurrencyCode | string;
  loading: boolean;
  estimatedFee: number;
  error: Error | null;
  transactionId: string;
  success: boolean;
}
