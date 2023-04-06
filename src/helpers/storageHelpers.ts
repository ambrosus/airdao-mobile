import * as SecureStore from 'expo-secure-store';
export const storeData = async (key: string, value: string) => {
  console.log(key, value);
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.log('There was an error storing Data', error);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('There was an error getting Data', error);
  }
};

export const deleteData = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log('There was an error removing data', error);
  }
};
