import { ExplorerAccount } from '@models/Explorer';
import {
  createContext,
  useContext,
  useContextSelector
} from 'use-context-selector';

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

const initialState: AllAddressesContextState = {
  addresses: []
};

export const AllAddressesContext = createContext<
  [AllAddressesContextState, AllAddressesDispatch]
>([initialState, () => null]);

export const useAllAddressesContext = (): [
  AllAddressesContextState,
  AllAddressesDispatch
] => {
  return useContext(AllAddressesContext);
};

export const useAllAddresses = () => {
  return useContextSelector(AllAddressesContext, (v) => v[0].addresses);
};

export const useAllAddressesReducer = () => {
  return useContextSelector(AllAddressesContext, (v) => v[1]);
};
