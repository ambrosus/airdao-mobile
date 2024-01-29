import { CryptoCurrencyCode } from '@appTypes';

export interface SendCryptoContextState {
  from: string;
  to: string;
  walletHash: string;
  amount: number;
  currency: CryptoCurrencyCode;
  loading: boolean;
  estimatedFee: number;
  error: Error | null;
  transactionId: string; // random tx id for internal usage
}

type SendCryptoActionType = 'SET_DATA' | 'RESET_DATA';

export type SendCryptoDispatchPayload = Partial<SendCryptoContextState> & {
  type: SendCryptoActionType;
};

export type SendCryptoDispatch = (payload: SendCryptoDispatchPayload) => void;
