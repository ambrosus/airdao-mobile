import { ExplorerAccount } from '@models/Explorer';

export type AllAddressesActionType =
  | 'add'
  | 'remove'
  | 'update'
  | 'add-or-update';

export type AllAddressesAction = {
  type: AllAddressesActionType;
  payload: ExplorerAccount;
};

export type AllAddressesDispatch = (action: AllAddressesAction) => void;
