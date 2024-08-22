import { IsNullableAccount, Action, WalletReducerKeys } from './wallet.types';

export const reducer = (
  state: IsNullableAccount,
  action: Action
): IsNullableAccount => {
  const { type, payload } = action;

  switch (type) {
    case WalletReducerKeys.SET_ACCOUNT:
      return payload || null;
    default:
      return state;
  }
};
