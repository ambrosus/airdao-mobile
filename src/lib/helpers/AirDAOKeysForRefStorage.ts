import * as SecureStore from 'expo-secure-store';

class AirDAOKeysForRefStorage {
  private serviceName: string;

  constructor(serviceName = 'AirDAOKeysRefStorage') {
    this.serviceName = serviceName;
  }

  async getPublicAndPrivateResultForHash(hash: string): Promise<any> {
    const res = await SecureStore.getItemAsync('cd_' + hash);
    if (!res) return false;
    return JSON.parse(res);
  }

  async setPublicAndPrivateResultForHash(
    hash: string,
    data: any
  ): Promise<void> {
    return SecureStore.setItemAsync('cd_' + hash, JSON.stringify(data));
  }
}

const singleAirDAOKeysRefStorage = new AirDAOKeysForRefStorage();
export default singleAirDAOKeysRefStorage;
