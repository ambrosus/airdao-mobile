import { useReducer } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { reducer } from './wallet.reducer';

export const WalletContext = () => {
  const [wallet, dispatch] = useReducer(reducer, null);

  return { wallet, dispatchWallet: dispatch };
};

export const [WalletContextProvider, useWalletContext] =
  createContextSelector(WalletContext);

export const useWalletContextSelector = () => useWalletContext((ctx) => ctx);
