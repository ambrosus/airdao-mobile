export interface WalletMetadata {
  name: string;
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
