import { Cache, CacheKey } from '../cache';
import * as SecureStore from 'expo-secure-store';
import { DefaultNotificationSettings } from '@constants/variables';

jest.mock('expo-secure-store');

describe('Cache', () => {
  it('should return parsed notification settings from SecureStore', async () => {
    const notificationSettings = { enabled: true, sound: 'default' };
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(notificationSettings)
    );
    const result = await Cache.getNotificationSettings();
    expect(result).toEqual(notificationSettings);
  });

  it('should return default notification settings if SecureStore returns null', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    const result = await Cache.getNotificationSettings();
    expect(result).toEqual(DefaultNotificationSettings);
  });

  it('should throw an error if SecureStore throws an error', async () => {
    const errorMessage = 'Unexpected token i in JSON at position 0';
    const error = new Error(errorMessage);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
      'invalid json'
    );
    await expect(Cache.getNotificationSettings()).rejects.toThrow(error);
  });

  it('should set an item in SecureStore', async () => {
    const key = CacheKey.Watchlist;
    const item = ['BTC', 'USDT', 'ETH'];
    await Cache.setItem(key, item);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      key,
      JSON.stringify(item)
    );
  });

  it('should return parsed item from SecureStore', async () => {
    const key = CacheKey.AddressLists;
    const item = {
      favorites: [
        '6200de3b523162b8b87baff1',
        '0xF977814e90dA44bFA03b6295A0616a897441aceC'
      ],
      recent: []
    };
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(item)
    );
    const result = await Cache.getItem(key);
    expect(result).toEqual(item);
  });

  it('should return null if SecureStore returns null', async () => {
    const key = CacheKey.AddressLists;
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    const result = await Cache.getItem(key);
    expect(result).toBeNull();
  });

  it('should delete an item from SecureStore', async () => {
    const key = CacheKey.AllAddresses;
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('value');
    const item = await SecureStore.getItemAsync(key);
    expect(item).not.toBeNull();
    await Cache.deleteItem(key);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key);
    const deletedItem = await SecureStore.getItemAsync(key);
    expect(deletedItem).toBeUndefined();
  });
});
