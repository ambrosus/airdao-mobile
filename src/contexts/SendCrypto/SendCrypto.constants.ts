import { CryptoCurrencyCode } from '@appTypes';
import { SendCryptoContextState } from './SendCrypto.types';

export const SEND_CRYPTO_INITIAL_STATE: SendCryptoContextState = {
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
};
