import { useState } from 'react';
import {
  SendCryptoContextState,
  SendCryptoDispatch,
  SendCryptoDispatchPayload
} from './SendCrypto.types';
import { createContextSelector } from '@utils/createContextSelector';
import { SEND_CRYPTO_INITIAL_STATE } from './SendCrypto.constants';

const SendCryptoContext = (): {
  state: Partial<SendCryptoContextState>;
  reducer: SendCryptoDispatch;
} => {
  const [state, setState] = useState<Partial<SendCryptoContextState>>(
    SEND_CRYPTO_INITIAL_STATE
  );

  const reducer = (payload: SendCryptoDispatchPayload) => {
    switch (payload.type) {
      case 'SET_DATA': {
        setState({
          ...state,
          ...payload
        });
        break;
      }
      case 'RESET_DATA': {
        setState(SEND_CRYPTO_INITIAL_STATE);
        break;
      }
      default: {
        break;
      }
    }
  };

  return { state, reducer };
};

export const [SendCryptoProvider, useSendCryptoContext] =
  createContextSelector(SendCryptoContext);
