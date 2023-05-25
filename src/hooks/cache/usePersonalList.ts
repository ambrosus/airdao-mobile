import { useAllAddresses, useAllAddressesReducer } from '@contexts';
import { ExplorerAccount } from '@models/Explorer';

export const usePersonalList = () => {
  const allAddressesReducer = useAllAddressesReducer();
  const allAddresses = useAllAddresses();

  const addToPersonalList = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isPersonal = true;
    allAddressesReducer({ type: 'add-or-update', payload: newAddress });
  };

  const removeFromPersonalList = async (address: ExplorerAccount) => {
    const newAddress = Object.assign({}, address);
    newAddress.isPersonal = false;
    allAddressesReducer({ type: 'add-or-update', payload: newAddress });
  };

  return {
    personalList: allAddresses.filter((account) => account.isPersonal),
    addToPersonalList,
    removeFromPersonalList
  };
};
