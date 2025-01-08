import { create } from 'zustand';

interface AddWalletStore {
  hash: string;
  name: string;
  mnemonic: string;
  mnemonicLength: number;
  // Actions
  onChangeHash: (payload: string) => void;
  onChangeName: (payload: string) => void;
  onChangeMnemonic: (payload: string) => void;
  onChangeMnemonicLength: (payload: number) => void;
}

export const useAddWalletStore = create<AddWalletStore>((set) => ({
  hash: '',
  name: '',
  mnemonic: '',
  mnemonicLength: 0,

  onChangeHash: (payload: string) => {
    set({ hash: payload });
  },
  onChangeName: (payload: string) => {
    set({ name: payload });
  },
  onChangeMnemonic: (payload: string) => {
    set({ mnemonic: payload });
  },
  onChangeMnemonicLength: (payload: number) => {
    set({ mnemonicLength: payload });
  }
}));
