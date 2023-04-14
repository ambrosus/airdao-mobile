import { ExplorerAccount } from '@models/Explorer';
import {
  createContext,
  useContext,
  useContextSelector
} from 'use-context-selector';

export interface AllAdressesContextState {
  addresses: ExplorerAccount[];
}

export type AllAddressesActionType = 'add' | 'remove' | 'update';
export type AllAddressesAction = {
  type: AllAddressesActionType;
  payload: ExplorerAccount;
};
export type AllAddressesDispatch = (action: AllAddressesAction) => void;

const initialState: AllAdressesContextState = {
  addresses: []
};

export const AllAdressesContext = createContext<
  [AllAdressesContextState, AllAddressesDispatch]
>([initialState, () => null]);

export const useAllAddressesContext = (): [
  AllAdressesContextState,
  AllAddressesDispatch
] => {
  return useContext(AllAdressesContext);
};

export const useAllAddresses = () => {
  return useContextSelector(AllAdressesContext, (v) => v[0].addresses);
};

export const useAllAddressesReducer = () => {
  return useContextSelector(AllAdressesContext, (v) => v[1]);
};
