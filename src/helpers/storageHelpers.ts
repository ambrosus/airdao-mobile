import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeData = async (key: string, value: string) => {
  console.log(key, value);
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('There was an error storing Data', error);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('There was an error getting Data', error);
  }
};

export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('There was an error removing data', error);
  }
};
