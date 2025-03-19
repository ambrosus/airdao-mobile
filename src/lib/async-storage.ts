import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from '@lib/storage.model';

export const setConnectedAddressTo = async (uri: string, address: string) => {
  await AsyncStorage.setItem(
    `${AsyncStorageKey.connectedAddressTo}:${uri}`,
    address
  );
};

export const getConnectedAddressTo = async (uri: string) => {
  return await AsyncStorage.getItem(
    `${AsyncStorageKey.connectedAddressTo}:${uri}`
  );
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};
