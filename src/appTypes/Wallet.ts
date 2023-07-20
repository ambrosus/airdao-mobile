export interface WalletMetadata {
  _id?: string;
  name: string;
  mnemonic: string;
  newMnemonic?: string;
  number: number;
  hash?: string;
  createdAt?: number;
}

export enum WalletInitSource {
  GENERATION = 'GENERATION',
  IMPORT = 'IMPORT'
}
