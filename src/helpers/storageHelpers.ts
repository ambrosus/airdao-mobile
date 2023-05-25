import * as SecureStore from 'expo-secure-store';
export const setDataToSecureStore = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    throw error;
  }
};

export const getDataToSecureStore = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    throw error;
  }
};

export const deleteDataToSecureStore = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    throw error;
  }
};
