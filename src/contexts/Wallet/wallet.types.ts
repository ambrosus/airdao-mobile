import { AccountDBModel } from '@database/models';

export enum WalletReducerKeys {
  SET_ACCOUNT = 'SET_ACCOUNT'
}

export type IsNullableAccount = AccountDBModel | null;

export interface Action {
  type: WalletReducerKeys;
  payload?: IsNullableAccount;
}
