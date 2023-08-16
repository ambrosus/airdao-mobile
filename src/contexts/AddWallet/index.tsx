import { useState } from 'react';
import { createContextSelector } from '@helpers/createContextSelector';
import { AddWalletContextState, AddWalletFlowType } from './AddWallet.types';

const AddWalletContext = (): AddWalletContextState => {
  const [flowType, setFlowType] = useState<AddWalletFlowType>(
    AddWalletFlowType.CREATE_WALLET
  );
  const [walletHash, setWalletHash] = useState('');
  const [walletName, setWalletName] = useState('');
  const [walletMnemonic, setWalletMnemonic] = useState('');
  const [mnemonicLength, setMnemonicLength] = useState(0);
  return {
    flowType,
    setFlowType,
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
