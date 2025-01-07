import { CryptoCurrencyCode } from '@appTypes';
import { SendFundsState } from '../model/types';

export const SEND_FUNDS_INITIAL_STATE = {
  from: '',
  to: '',
  walletHash: '',
  amount: 0,
  currency: CryptoCurrencyCode.AMB,
  loading: false,
  estimatedFee: 0,
  error: null,
  transactionId: '',
  success: false
} as SendFundsState;
