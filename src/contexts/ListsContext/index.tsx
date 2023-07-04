import { createContextSelector } from '@helpers/createContextSelector';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetRef } from '@components/composite';
import { randomUUID } from 'expo-crypto';
import { AccountList } from '@models/AccountList';
import { CacheableAccountList } from '@appTypes/CacheableAccountList';
import { Cache, CacheKey } from '@utils/cache';
import {
  useAllAddresses,
  useAllAddressesReducer
} from '@contexts/AllAddresses';
import { ExplorerAccount } from '@models/Explorer';
import { explorerService } from '@api/explorer-service';
import { ExplorerAccountDTO } from '@models';
import { API } from '@api/api';

const testAddresses = [
  '0x68c66f1C56CC6341856cf4427650978B653C78D6',
  '0x0039e7CD3d93a0a9406c615B3a53aAC98E9AC2FA',
  '0x51C17E332299dAaADCB9C8dd74F7C4845aEB52F6',
  '0xcC2c510Ad2a0560c2d6F2D25a9C9F7Ed4Ac73e38',
  '0xaf33c3aF89bb42e69986464112a8f16EfD6d5385',
  '0xe6bD0883FE12D27B06Fe6b6141aEb3B4B28b1e8d',
  '0xb240cC8AA3B1F2CEe1952c345Bf7E739f817a6F1',
  '0x185184cDda373251a3f1214CE7F0a6b4c77D67E5',
  '0x5580f520170A157E8a5487484923a00b483086f5',
  '0x65fba609b7733D1Ce8B8FF36443F6E6021ec3c9C',
  '0xBdfeF07501640B29c0F83bAf743bA26e84e3fA4E',
  '0x7817e59A127747BA29CA6Cadc479f424C9305Bf5',
  '0x5536077879D254cC2522edb9B1c982Cde42E54ec',
  '0x27c4c7A76B7a8aCed60aDd6660d6795D4b27B405',
  '0xD6c64a54499d72cf39bB55E04015e3D5EE06EFA6',
  '0x94f7D04a80d87f4b0901C4C8CF81ae1550eB4D42',
  '0x4172336bD62f8AfAbc400A081fD7330b0516cD2b',
  '0x8dc7Cb47A94F83a7CA9C28B6D651B3954f6c67b2',
  '0x2DEf9b0B2323e4fF2D10B441C99731e71110db5d',
  '0x6Ab687E00eaE69af1D70E22Db005532A6A387058',
  '0x011BD93B619E22619f4daD390c5e301E172D2C46',
  '0x81D6c2C960B6ddf89e251b33C2041Ac913036780',
  '0xc339Fc7a393028d5a3610Eaf81fE3e04657f95A7',
  '0xff4397289C60739B8108D27242208319f6CF5af2',
  '0x34A99d80F5569Ba7955fC3d81f4BB9b6Be53541A',
  '0xaD74bd2D73dC4842a0110bE75A05beC170cAB356',
  '0x54A58F3907088408809c2B08455821080dA145DE',
  '0x28f1Ebbcc1d5732896A6077C30B3F1b1D18B1817',
  '0xc6C6542eCD5dd9Da6Be4B3bb8751e7E57aDbd2B1',
  '0x2F444d0E996FD05193B202d53Bc0ad4c3311629e',
  '0x64A6c16FABD68b23daDccd2b18cF5b99257c3600',
  '0x2e5ee9c8F8195a49553d21Dd24c20b3E640028eb',
  '0x19f69D3B280395a5552d76e44b8fE6BEa85CE500',
  '0x350EB3da81987520B53c548dE7Aeb6150AD58A24',
  '0x7218903B7DBed0Cb0ab0D0Ce5675ea049EF4c5f4',
  '0xEA1Befd1a5cC0165f3Bcd353eC2338Ec56b93d92',
  '0xf6b6afCAcBf1c5c8651d381321f3065C95CdF5da',
  '0xFC44b5d74701AAa8F5c5D3e9543fc4d2ce6B7A7E',
  '0x665b385aA0A7Fe7E03d7fb020967633dE9B2b8D3',
  '0xdf3b6c439117D4D90A6aAE89956aa59f98269307',
  '0x994984Aaea85D55714a55C6Af078562ACD240bce',
  '0xcC7DD4B5630e16bB676A1af08f39d4e6Fd6ee094',
  '0xCaCC870f4856b291EF070fB5426f2d996ED4e0d4',
  '0x38d9Dc2644ECf471dceC6d3041E48CF321fF99CC',
  '0xd2A13daa7d9390Cf63925B82D9A708a1e27C9f15',
  '0xBFdB12cB67365CA3C38673d0C66ee19D31A151B8',
  '0xaa45A61f5cc10e845BAEe43f9b2468B839ABc9Aa',
  '0xa7934828a3Db49cb8F0a10CbcC4FFeb69E13f91B',
  '0x19690E7267Adf28c11494248C3d5561bb7aeDBbA',
  '0x8e224ea3892a25064f380d9A58F3197C4A5e0ef8',
  '0xb5B563e5ed9A9d4eaad3F498F497943d637920f3'
];

const ListsContext = () => {
  const allAddresses = useAllAddresses();
  const allAddressesReducer = useAllAddressesReducer();
  // save lists locally
  const [listsOfAddressGroup, setListsOfAddressGroup] = useState<
    CacheableAccountList[]
  >([]);
  const lists = useMemo(() => {
    const populatedLists: AccountList[] = listsOfAddressGroup.map(
      (l) =>
        new AccountList({
          ...l,
          accounts: l.addresses?.map(
            (address) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              allAddresses.find(
                (populatedAddress) => populatedAddress.address === address
              )!
          )
        })
    );
    return populatedLists;
  }, [allAddresses, listsOfAddressGroup]);

  // ref for open Create new SingleCollection modal
  const createGroupRef = useRef<BottomSheetRef>(null);

  // handle function for deleting list
  const handleOnDelete = useCallback(
    async (selectedGroupId: string) => {
      listsOfAddressGroup.removeItem(
        {
          id: selectedGroupId,
          name: '',
          addresses: []
        },
        'id'
      );
      setListsOfAddressGroup([...listsOfAddressGroup]);
    },
    [listsOfAddressGroup, setListsOfAddressGroup]
  );

  // handle function for creating list
  const handleOnCreate = useCallback(
    async (value: string) => {
      const newGroupOfAddresses: CacheableAccountList = {
        id: randomUUID(),
        name: value,
        addresses: []
      };
      const newGroupsOfAddresses = [
        ...listsOfAddressGroup,
        newGroupOfAddresses
      ];
      setListsOfAddressGroup(newGroupsOfAddresses);
      createGroupRef.current?.dismiss();
      return newGroupOfAddresses;
    },
    [listsOfAddressGroup]
  );

  // handle function for renaming list
  const handleOnRename = useCallback(
    async (selectedGroupId: string, newGroupName: string) => {
      const newGroupsOfAddresses: CacheableAccountList[] =
        listsOfAddressGroup.map((group) =>
          selectedGroupId === group.id
            ? { ...group, name: newGroupName }
            : group
        );
      setListsOfAddressGroup(newGroupsOfAddresses);
    },
    [listsOfAddressGroup]
  );

  // handle function for adding address to group
  const handleOnAddNewAddresses = useCallback(
    async (selectedAddresses: ExplorerAccount[], groupId: string) => {
      const editedGroupsOfAddresses = listsOfAddressGroup.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            addresses: selectedAddresses.map((a) => a.address)
          };
        }
        return group;
      });
      setListsOfAddressGroup(editedGroupsOfAddresses);
    },
    [listsOfAddressGroup]
  );

  const handleOnAddressMove = async (
    selectedGroupsIds: string[],
    selectedAddresses: ExplorerAccount[]
  ) => {
    const selectedAddressesIds = selectedAddresses.map((elem) => elem.address);
    const addressConcat = (groupAddresses: string[]) => {
      const set = new Set([...groupAddresses, ...selectedAddressesIds]);
      return [...set.values()];
    };

    const editedGroups = listsOfAddressGroup.map((group) => {
      if (selectedGroupsIds.includes(group.id)) {
        return {
          ...group,
          addresses: addressConcat(group.addresses)
        };
      } else {
        return {
          ...group,
          addresses: group.addresses.filter(
            (address) => !selectedAddressesIds.includes(address)
          )
        };
      }
    });
    setListsOfAddressGroup(editedGroups);
  };

  const handleOnDeleteAddressFromGroup = (
    groupId: string,
    idsOfSelectedAddresses: string[]
  ) => {
    const updatedGroups: CacheableAccountList[] = listsOfAddressGroup.map(
      (group) => {
        if (groupId === group.id) {
          const currentGroup = {
            ...group,
            addresses: group.addresses.filter((currentAddress) => {
              return !idsOfSelectedAddresses.includes(currentAddress);
            })
          };
          return currentGroup;
        } else {
          return group;
        }
      }
    );
    setListsOfAddressGroup(updatedGroups);
  };

  const toggleAddressesInList = (
    accounts: ExplorerAccount[],
    list: AccountList,
    ownGroup?: CacheableAccountList[]
  ) => {
    const groups = ownGroup || listsOfAddressGroup;
    accounts.forEach((account) => {
      const newAddress: ExplorerAccount = Object.assign({}, account);
      const listInContext = groups.find((l) => l.id === list.id);
      if (!listInContext) return;
      if (listInContext.addresses.indexOfItem(account.address) > -1) {
        listInContext.addresses.removeItem(account.address);
      } else {
        listInContext.addresses.push(account.address);
        // add to watchlist if not watchlisted
        if (!newAddress.isOnWatchlist) newAddress.isOnWatchlist = true;
      }
      groups.forEach((l) => {
        if (l.id !== list.id && l.addresses.indexOfItem(account.address) > -1) {
          l.addresses.removeItem(account.address);
        }
      });
      if (allAddresses.indexOfItem(account, 'address') === -1) {
        allAddresses.push(newAddress);
      }
    });
    allAddressesReducer({ type: 'set', payload: allAddresses });
    // timeout ensures that the account has been added to all addresses
    // setTimeout(() => {
    setListsOfAddressGroup([...groups]);
    // }, 0);
  };

  useEffect(() => {
    const getLists = async () => {
      const lists = ((await Cache.getItem(CacheKey.AddressLists)) ||
        []) as CacheableAccountList[];
      setListsOfAddressGroup(lists);
      const newGroupOfAddresses = await handleOnCreate('TSESTSTST');
      // const test = await API.explorerService.searchAddress(
      //   '0x68c66f1C56CC6341856cf4427650978B653C78D6'
      // );
      const res = await Promise.all(
        testAddresses.map(
          async (address) => await API.explorerService.searchAddress(address)
        )
      );
      console.log(res, ';lkamsd');
      const newGroup = new AccountList({
        ...newGroupOfAddresses,
        accounts: []
      });
      toggleAddressesInList(
        res.map((ea: ExplorerAccountDTO) => new ExplorerAccount(ea)),
        new AccountList({
          ...newGroupOfAddresses,
          accounts: []
        }),
        [...lists, newGroupOfAddresses]
      );
    };
    getLists();
  }, []);

  console.log(listsOfAddressGroup);

  return {
    listsOfAddressGroup: lists,
    listsOfAddressGroupCacheable: listsOfAddressGroup,
    setListsOfAddressGroup,
    handleOnDelete,
    handleOnCreate,
    handleOnRename,
    createGroupRef,
    handleOnAddNewAddresses,
    handleOnAddressMove,
    handleOnDeleteAddressFromGroup,
    toggleAddressesInList
  };
};

export const [ListsContextProvider, useLists] =
  createContextSelector(ListsContext);
