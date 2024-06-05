import { ethers } from 'ethers';
import AirDAOKeys from './AirDAOKeys';
import { AddressUtils } from '@utils/address';
import AddressProcessor from '@lib/crypto/AddressProcessor';
import Config from '@constants/config';

const CACHE: { [key: string]: any } = {};

class AirDAOKeysForRef {
  async discoverPublicAndPrivate(data: {
    mnemonic: string;
    index?: number;
  }): Promise<{
    address: string;
    privateKey: string;
    path: string;
    index: number;
    type: unknown; // TODO
  }> {
    const mnemonicCache = data.mnemonic.toLowerCase();
    if (typeof CACHE[mnemonicCache] !== 'undefined')
      return CACHE[mnemonicCache];
    let result = AirDAOKeys.getEthCached(mnemonicCache);
    // let result;
    if (!result) {
      let index = 0;
      if (typeof data.index !== 'undefined') {
        index = data.index;
      }
      const root = await AirDAOKeys.getBip32Cached(data.mnemonic);
      const path = `m/44'/60'/${index}'/0/0`;
      const child = root.derivePath(path);
      result = await AddressProcessor.getAddressByPrivateKey(child.privateKey);
      result.index = index;
      result.path = path;
      if (index === 0) {
        AirDAOKeys.setEthCached(data.mnemonic, result);
      }
    }
    result.cashbackToken = AddressUtils.addressToToken(result.address);
    CACHE[mnemonicCache] = result;
    return result;
  }

  async discoverAccountViaPrivateKey(privateKey: string) {
    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    const wallet = new ethers.Wallet(privateKey, provider);

    const index = 0;
    const path = `m/44'/60'/${index}'/0/0`;

    return { ...wallet, index, path };
  }
}

const singleAirDAOKeysForRef = new AirDAOKeysForRef();
export default singleAirDAOKeysForRef;
