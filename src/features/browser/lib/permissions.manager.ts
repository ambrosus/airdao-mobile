import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AsyncStorageKey,
  DeprecatedBrowserStorage,
  SetConnectedAddressToModel,
  WalletsPermissions
} from '@features/browser/types/browser.storage.types';
import { mmkv } from '@lib/mmkv';

export const getConnectedAddressTo = (uri: string) => {
  const res = mmkv.getString(`${AsyncStorageKey.browser}${uri}`);

  if (res) {
    const data = JSON.parse(res);
    if (data?.addresses?.length === 1) return data.addresses[0];
    else return data.addresses;
  }

  return res;
};

export const setConnectedAddressTo = ({
  uri,
  addresses,
  icon
}: SetConnectedAddressToModel) => {
  const uriData = mmkv.getString(`${AsyncStorageKey.browser}${uri}`);
  if (!addresses.length) mmkv.delete(`${AsyncStorageKey.browser}${uri}`);

  if (uriData) {
    const data = JSON.parse(uriData);
    data.addresses = [...addresses];
    mmkv.set(`${AsyncStorageKey.browser}${uri}`, JSON.stringify(data));
  } else {
    const data = { addresses, ...(icon && { icon }) };
    mmkv.set(`${AsyncStorageKey.browser}${uri}`, JSON.stringify(data));
  }
};

export const removeConnectedAddressTo = (uri: string, address: string) => {
  const uriData = mmkv.getString(`${AsyncStorageKey.browser}${uri}`);

  if (uriData) {
    const data = JSON.parse(uriData);
    data.addresses = data.addresses.filter((item: string) => item !== address);

    if (data.addresses.length)
      mmkv.set(`${AsyncStorageKey.browser}${uri}`, JSON.stringify(data));
    else mmkv.delete(`${AsyncStorageKey.browser}${uri}`);
  }
};

export const removePermissionByAddress = (deletedAddress: string) => {
  const keys = mmkv
    .getAllKeys()
    .filter((item) => item.includes(AsyncStorageKey.browser));

  keys.map((key) => {
    const permission = mmkv.getString(key);
    const permissionItem = permission ? JSON.parse(permission) : {};

    if (permissionItem.addresses.includes(deletedAddress)) {
      permissionItem.addresses = [...permissionItem.addresses].filter(
        (address) => address !== deletedAddress
      );

      if (!permissionItem.addresses.length) mmkv.delete(key);
      else mmkv.set(key, JSON.stringify(permissionItem));
    }
  });
};

export const getAllWalletsPermissions: () => Promise<
  Awaited<WalletsPermissions>[]
> = async () => {
  const keys = mmkv.getAllKeys();

  return await Promise.all(
    keys
      .filter((item) => item.includes(AsyncStorageKey.browser))
      .map(async (key) => {
        const _data = mmkv.getString(key);
        return {
          [key.replace(AsyncStorageKey.browser, '')]: _data
            ? JSON.parse(_data)
            : ''
        };
      })
  );
};

export const migrateToNewBrowserStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();

  keys.map(async (key) => {
    if (key.includes(DeprecatedBrowserStorage.connectedAddressTo)) {
      const data = await AsyncStorage.getItem(key);
      const _key = key.replace(
        `${DeprecatedBrowserStorage.connectedAddressTo}:`,
        ''
      );
      if (data && _key) {
        setConnectedAddressTo({ uri: _key, addresses: [data] });
        await AsyncStorage.removeItem(key);
      }
    }
  });
};
