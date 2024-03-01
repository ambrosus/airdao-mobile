export interface AddWalletContextState {
  walletHash: string;
  setWalletHash: React.Dispatch<React.SetStateAction<string>>;
  walletName: string;
  setWalletName: React.Dispatch<React.SetStateAction<string>>;
  walletMnemonic: string;
  setWalletMnemonic: React.Dispatch<React.SetStateAction<string>>;
  mnemonicLength: number;
  setMnemonicLength: React.Dispatch<React.SetStateAction<number>>;
}
