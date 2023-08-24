export interface WalletMetadata {
  pub: string;
  name: string;
  mnemonic: string;
  number: number;
  hash?: string;
  cashback?: string;
  isBackedUp?: number;
  isHideTransactionForFee?: number;
  allowReplaceByFee?: number;
  useLegacy?: number;
  useUnconfirmed?: number;
  isHd?: number;
  isCreatedHere?: number;
  toSendStatus?: number;
  newMnemonic?: string;
}

export enum WalletInitSource {
  GENERATION = 'GENERATION',
  IMPORT = 'IMPORT'
}
