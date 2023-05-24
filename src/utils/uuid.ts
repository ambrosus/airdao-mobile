import { randomUUID } from 'expo-crypto';
import { Cache, CacheKey } from './cache';

const generateRandomUUID = (): string => {
  return randomUUID();
};

const getDeviceID = async (): Promise<string> => {
  return (await Cache.getItem(CacheKey.DeviceID)) as string;
};

export const UUID_UTILS = { generateRandomUUID, getDeviceID };
