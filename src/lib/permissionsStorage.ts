// import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountDBModel } from '@database';
import {
  ConnectionDetails,
  StorageKeys,
  WalletConnectionDetails
} from '@lib/storage.model';

export const PermissionStorage = AsyncStorage;

const getWalletConnectionDetails = async (address: string) => {
  return await PermissionStorage.getItem(
    `${StorageKeys.walletPermissionsDetails}${address}`
  );
};
const setWalletConnectionDetails = async (
  address: string,
  connectionDetails: any
) => {
  await PermissionStorage.setItem(
    `${StorageKeys.walletPermissionsDetails}${address}`,
    JSON.stringify(connectionDetails)
  );
};

export const getAllPermissionKeys = async () => {
  const allKeys = await PermissionStorage.getAllKeys();
  return allKeys.filter((key) =>
    key.includes(StorageKeys.walletPermissionsDetails)
  );
};

export const getWalletsPermissions: () => Promise<
  Awaited<WalletConnectionDetails>[]
> = async () => {
  const allKeys = await getAllPermissionKeys();
  return await Promise.all(
    allKeys.map(async (key) => {
      const address = key.replace(StorageKeys.walletPermissionsDetails, '');
      const productData = await getWalletConnectionDetails(address);
      return {
        address,
        data:
          typeof productData === 'string'
            ? JSON.parse(productData)
            : productData
      };
    })
  );
};

export const setWalletPermissions = async (
  address = '',
  data: ConnectionDetails
) => {
  if (address) {
    const connectedProduct = (await getWalletConnectionDetails(address)) || '';
    const _connectedProduct: ConnectionDetails[] = connectedProduct
      ? JSON.parse(connectedProduct)
      : [];
    _connectedProduct.push(data);
    await setWalletConnectionDetails(address, _connectedProduct);
  }
};

export const removeWalletPermission = async (address = '', uri = '') => {
  if (address && uri) {
    const data = getWalletConnectionDetails(address);
    console.log('REVOKE-data', data);
  }
};
