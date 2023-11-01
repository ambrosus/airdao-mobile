import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

export interface SendCryptoContextState {
  from: string;
  to: string;
  walletHash: string;
  amount: number;
  currency: AirDAODictTypes.Code;
  currencyConversionRate: number; // {currency}/USD
  loading: boolean;
  estimatedFee: number;
  error: Error | null;
}

type SendCryptoActionType = 'SET_DATA' | 'RESET_DATA';

export type SendCryptoDispatchPayload = Partial<SendCryptoContextState> & {
  type: SendCryptoActionType;
};

export type SendCryptoDispatch = (payload: SendCryptoDispatchPayload) => void;
