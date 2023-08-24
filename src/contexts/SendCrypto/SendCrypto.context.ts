import { useState } from 'react';
import {
  SendCryptoContextState,
  SendCryptoDispatch,
  SendCryptoDispatchPayload
} from './SendCrypto.types';
import { createContextSelector } from '@helpers/createContextSelector';
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
      case 'RESET_DATA_BLOCKCHAIN': {
        setState({
          ui: {
            ...state.ui
          },
          dict: {
            ...state.dict
          },
          fromBlockchain: {
            ...payload.fromBlockchain
          }
        });
        return;
      }
      case 'SET_DATA': {
        setState({
          ui: {
            ...state.ui,
            ...payload.ui
          },
          dict: {
            ...state.dict,
            ...payload.dict
          },
          fromBlockchain: {
            ...state.fromBlockchain,
            ...payload.fromBlockchain
          }
        });
        return;
      }
      case 'RESET_DATA': {
        setState({
          ui: {
            ...SEND_CRYPTO_INITIAL_STATE.ui,
            ...payload.ui
          },
          dict: {
            ...SEND_CRYPTO_INITIAL_STATE.dict,
            ...payload.dict
          },
          fromBlockchain: {
            ...SEND_CRYPTO_INITIAL_STATE.fromBlockchain
          }
        });
        return;
      }
      case 'CLEAN_DATA':
        setState({
          ui: {},
          dict: {},
          fromBlockchain: {}
        });
      default: {
        return;
      }
    }
  };

  return { state, reducer };
};

export const [SendCryptoProvider, useSendCryptoContext] =
  createContextSelector(SendCryptoContext);
