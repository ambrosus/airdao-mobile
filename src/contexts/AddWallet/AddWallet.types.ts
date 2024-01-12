export enum AddWalletFlowType {
  CREATE_WALLET = 'CREATE_WALLET',
  RESTORE_WALLET = 'RESTORE_WALLET'
}

export interface AddWalletContextState {
  flowType: AddWalletFlowType;
  setFlowType: React.Dispatch<React.SetStateAction<AddWalletFlowType>>;
  walletHash: string;
  setWalletHash: React.Dispatch<React.SetStateAction<string>>;
  walletName: string;
  setWalletName: React.Dispatch<React.SetStateAction<string>>;
  walletMnemonic: string;
  setWalletMnemonic: React.Dispatch<React.SetStateAction<string>>;
  mnemonicLength: number;
  setMnemonicLength: React.Dispatch<React.SetStateAction<number>>;
}
