import { AccountDBModel } from '@database';

export type IsNullableAccount = AccountDBModel | null;

export interface WalletStore {
  wallet: IsNullableAccount | null;
  setWallet: (wallet: IsNullableAccount) => void;
}
