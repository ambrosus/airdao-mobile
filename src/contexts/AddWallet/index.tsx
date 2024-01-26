import { useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { AddWalletContextState } from './AddWallet.types';

const AddWalletContext = (): AddWalletContextState => {
  const [walletHash, setWalletHash] = useState('');
  const [walletName, setWalletName] = useState('');
  const [walletMnemonic, setWalletMnemonic] = useState('');
  const [mnemonicLength, setMnemonicLength] = useState(0);
  return {
    walletHash,
    setWalletHash,
    walletName,
    setWalletName,
    walletMnemonic,
    setWalletMnemonic,
    mnemonicLength,
    setMnemonicLength
  };
};

const [_AddWalletProvider, _useAddWalletContext] =
  createContextSelector(AddWalletContext);

export const useAddWalletContext = () => {
  return _useAddWalletContext((v) => v);
};

export const AddWalletProvider = _AddWalletProvider;

export * from './AddWallet.types';
