import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import uuid from './uuid';
import * as AES from './aes';

const storageFileUriKey = 'storage_file_uri';
const storageDirectoryUri = `${FileSystem.documentDirectory}persist-storage/`;

const createDirectory = async () => {
  try {
    const { exists } = await FileSystem.getInfoAsync(storageDirectoryUri);
    if (!exists) {
      await FileSystem.makeDirectoryAsync(storageDirectoryUri, {
        intermediates: true
      });
    }
  } catch (error) {
    console.error('Error creating directory:', error);
  }
};

const getAsync = async (key, secureStoreOptions) => {
  try {
    let value = null;
    const aesKey = await SecureStore.getItemAsync(key, secureStoreOptions);
    if (aesKey) {
      const storageFileUri = await fixedStorageUri(secureStoreOptions);
      if (storageFileUri) {
        const storageString = await FileSystem.readAsStringAsync(
          storageFileUri
        );
        if (storageString) {
          const storage = JSON.parse(storageString);
          const encryptedValue = storage[key];
          value = AES.decrypt(encryptedValue, aesKey);
        }
      }
    }
    return value;
  } catch (error) {
    await removeAsync(key);
    console.error('Error getting value:', error);
    throw error;
  }
};

const setAsync = async (key, value, secureStoreOptions) => {
  try {
    let storage = {};
    const currentStorageFileUri = await fixedStorageUri(secureStoreOptions);
    if (currentStorageFileUri) {
      const storageString = await FileSystem.readAsStringAsync(
        currentStorageFileUri
      );
      if (storageString) {
        storage = JSON.parse(storageString);
      }
    }

    const { encryptionKey, encryptedData } = AES.encryptWithRandomKey(value);
    storage[key] = { encryptionKey, encryptedData };
    const storageString = JSON.stringify(storage);

    const newStorageFileUri = await generateStorageFileUri();
    await FileSystem.writeAsStringAsync(newStorageFileUri, storageString);
    await SecureStore.setItemAsync(
      storageFileUriKey,
      newStorageFileUri,
      secureStoreOptions
    );
    if (currentStorageFileUri) {
      await FileSystem.deleteAsync(currentStorageFileUri, { idempotent: true });
    }
  } catch (error) {
    console.error('Error setting value:', error);
    throw error;
  }
};

const removeAsync = async (key, secureStoreOptions) => {
  try {
    const currentStorageFileUri = await fixedStorageUri(secureStoreOptions);
    if (currentStorageFileUri) {
      let storageString = await FileSystem.readAsStringAsync(
        currentStorageFileUri
      );
      let storage = {};
      if (storageString) {
        storage = JSON.parse(storageString);
        delete storage[key];
        storageString = JSON.stringify(storage);
        const newStorageFileUri = await generateStorageFileUri();
        await FileSystem.writeAsStringAsync(newStorageFileUri, storageString);
        await SecureStore.setItemAsync(
          storageFileUriKey,
          newStorageFileUri,
          secureStoreOptions
        );
        await FileSystem.deleteAsync(currentStorageFileUri, {
          idempotent: true
        });
      }
    }
    await SecureStore.deleteItemAsync(key, secureStoreOptions);
  } catch (error) {
    console.error('Error removing value:', error);
    throw error;
  }
};

const generateStorageFileUri = async () => {
  try {
    const fileName = uuid();
    const uri = `${storageDirectoryUri}${fileName}`;
    return uri;
  } catch (error) {
    console.error('Error generating storage file URI:', error);
    throw error;
  }
};

const fixedStorageUri = async (secureStoreOptions) => {
  try {
    const currentStorageFileUri = await SecureStore.getItemAsync(
      storageFileUriKey,
      secureStoreOptions
    );
    if (currentStorageFileUri) {
      const components = currentStorageFileUri.split('persist-storage/');
      if (components.length === 2) {
        const fileName = components[1];
        const uri = `${storageDirectoryUri}${fileName}`;
        const { exists } = await FileSystem.getInfoAsync(uri);
        if (exists) {
          return uri;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting fixed storage URI:', error);
    throw error;
  }
};

export { createDirectory, getAsync, setAsync, removeAsync };
