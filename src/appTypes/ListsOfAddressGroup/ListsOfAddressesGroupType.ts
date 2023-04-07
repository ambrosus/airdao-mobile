import { ListsOfAddressType } from './ListsOfAddressType';

export type ListsOfAddressesGroupType = {
  groupId: string;
  groupTitle: string;
  addressesCount: number;
  groupTokens: number;
  listOfAddresses: ListsOfAddressType[];
};
