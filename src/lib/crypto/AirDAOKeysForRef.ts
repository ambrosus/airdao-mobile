import AirDAOKeys from './AirDAOKeys';
import { AddressUtils } from '@utils/address';
import AddressProcessor from '@lib/crypto/AddressProcessor';

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
}

const singleAirDAOKeysForRef = new AirDAOKeysForRef();
export default singleAirDAOKeysForRef;
