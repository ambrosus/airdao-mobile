import { ExplorerAccount } from '@models/Explorer';

export interface AllAddressesContextState {
  addresses: ExplorerAccount[];
}

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
