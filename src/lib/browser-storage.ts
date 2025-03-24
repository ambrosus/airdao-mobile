import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AsyncStorageKey,
  DepressedBrowserStorage,
  SetConnectedAddressToModel,
  WalletsPermissions
} from '@lib/browser.storage.model';

const Storage = AsyncStorage;

export const getConnectedAddressTo = async (uri: string) => {
  const res = await AsyncStorage.getItem(`${AsyncStorageKey.browser}${uri}`);
  if (res) {
    const data = JSON.parse(res);
    if (data?.addresses?.length === 1) {
      return data.addresses[0];
    } else {
      return data.addresses;
    }
  }
  return res;
};

export const setConnectedAddressTo = async ({
  uri,
  addresses,
  icon
}: SetConnectedAddressToModel) => {
  const uriData = await Storage.getItem(`${AsyncStorageKey.browser}${uri}`);
  if (!addresses.length) {
    await Storage.removeItem(`${AsyncStorageKey.browser}${uri}`);
  }
  if (uriData) {
    const data = JSON.parse(uriData);
    data.addresses = [...addresses];

    await Storage.setItem(
      `${AsyncStorageKey.browser}${uri}`,
      JSON.stringify(data)
    );
  } else {
    const data = icon
      ? {
          icon,
          addresses
        }
      : {
          addresses
        };
    await Storage.setItem(
      `${AsyncStorageKey.browser}${uri}`,
      JSON.stringify(data)
    );
  }
};
export const removeConnectedAddressTo = async (
  uri: string,
  address: string
) => {
  const uriData = await Storage.getItem(`${AsyncStorageKey.browser}${uri}`);
  if (uriData) {
    const data = JSON.parse(uriData);
    data.addresses = data.addresses.filter((item: string) => item !== address);
    if (data.addresses.length) {
      await Storage.setItem(
        `${AsyncStorageKey.browser}${uri}`,
        JSON.stringify(data)
      );
    } else {
      await Storage.removeItem(`${AsyncStorageKey.browser}${uri}`);
    }
  }
};

export const removePermissionByAddress = async (deletedAddress: string) => {
  const keys = (await AsyncStorage.getAllKeys()).filter((item) =>
    item.includes(AsyncStorageKey.browser)
  );
  await Promise.all(
    keys.map(async (key) => {
      const permission = await AsyncStorage.getItem(key);
      const permissionItem = permission ? JSON.parse(permission) : {};
      if (permissionItem.addresses.includes(deletedAddress)) {
        permissionItem.addresses = [...permissionItem.addresses].filter(
          (address) => address !== deletedAddress
        );
        if (!permissionItem.addresses.length) {
          await AsyncStorage.removeItem(key);
        } else {
          await AsyncStorage.setItem(key, JSON.stringify(permissionItem));
        }
      }
    })
  );
};

export const getAllWalletsPermissions: () => Promise<
  Awaited<WalletsPermissions>[]
> = async () => {
  const keys = await AsyncStorage.getAllKeys();
  return await Promise.all(
    keys
      .filter((item) => item.includes(AsyncStorageKey.browser))
      .map(async (key) => {
        const _data = await AsyncStorage.getItem(key);
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
    if (key.includes(DepressedBrowserStorage.connectedAddressTo)) {
      const data = await AsyncStorage.getItem(key);
      const _key = key.replace(
        `${DepressedBrowserStorage.connectedAddressTo}:`,
        ''
      );
      if (data && _key) {
        await setConnectedAddressTo({ uri: _key, addresses: [data] });
        await AsyncStorage.removeItem(key);
      }
    }
  });
};
