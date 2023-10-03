import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { SendCryptoContextState } from './SendCrypto.types';

export const SEND_CRYPTO_INITIAL_STATE: SendCryptoContextState = {
  from: '',
  to: '',
  walletHash: '',
  amount: 0,
  currency: AirDAODictTypes.Code.AMB,
  currencyConversionRate: 0, // {currency}/US
  loading: false,
  estimatedFee: 0,
  error: null
};
